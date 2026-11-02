-- ====================================================================
-- FUNTOPIA SECURE SERVER-SIDE RPC FUNCTIONS
-- ====================================================================

-- Function to redeem an admin invitation code securely on the server
-- Runs as SECURITY DEFINER with elevated database privileges
CREATE OR REPLACE FUNCTION public.redeem_admin_invitation(access_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id UUID;
  v_code_hash TEXT;
  v_invitation RECORD;
BEGIN
  -- 1. Ensure user is authenticated
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Authentication required.');
  END IF;

  -- 2. Compute SHA-256 hash of provided plaintext code
  v_code_hash := encode(digest(access_code, 'sha256'), 'hex');

  -- 3. Check for matching, valid, unexpired, non-revoked invitation
  SELECT * INTO v_invitation
  FROM public.admin_invitations
  WHERE code_hash = v_code_hash
    AND is_redeemed = false
    AND is_revoked = false
    AND expires_at > now()
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid, expired, or revoked invitation code.');
  END IF;

  -- 4. Mark invitation as redeemed
  UPDATE public.admin_invitations
  SET is_redeemed = true,
      redeemed_by = v_user_id
  WHERE id = v_invitation.id;

  -- 5. Elevate user role in profiles to 'admin'
  UPDATE public.profiles
  SET role = 'admin',
      updated_at = now()
  WHERE id = v_user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Admin authorization granted.');
END;
$$;
