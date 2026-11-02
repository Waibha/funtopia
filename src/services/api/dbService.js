/**
 * FUNTOPIA PERSISTENCE & SUPABASE DATABASE SERVICE
 * 
 * Manages persistent storage in Supabase for:
 * 1. Participants (USN, Name, Hashed PIN, Avatar, Coin balance)
 * 2. Games catalog (Name, Coin entry cost, Default points earned, Active status)
 * 3. Competition score transactions (Points ledger for Live Leaderboard)
 * 4. Virtual coin transactions (Economy ledger for audit trail)
 * 5. System settings (Admin-controlled starting coins)
 */

import { supabase } from '../supabaseClient.js';

export const dbService = {
  /**
   * Loads all application data from Supabase.
   * Returns null if Supabase is offline or tables have not been created yet.
   */
  async loadFromSupabase() {
    if (!supabase) return null;

    try {
      const [
        { data: participants, error: pErr },
        { data: games, error: gErr },
        { data: scoreTxs, error: sErr },
        { data: coinTxs, error: cErr },
        { data: settingsRows, error: setErr },
      ] = await Promise.all([
        supabase.from('participants').select('*').order('created_at', { ascending: true }),
        supabase.from('games').select('*').order('created_at', { ascending: true }),
        supabase.from('score_transactions').select('*').order('timestamp', { ascending: false }),
        supabase.from('coin_transactions').select('*').order('timestamp', { ascending: false }),
        supabase.from('system_settings').select('*'),
      ]);

      // If any core table is missing in Supabase, return null to allow graceful fallback
      if (pErr || gErr || sErr || cErr) {
        console.warn('[dbService] Supabase tables not ready or query returned error:', {
          pErr: pErr?.message,
          gErr: gErr?.message,
          sErr: sErr?.message,
          cErr: cErr?.message,
        });
        return null;
      }

      // Map participants
      const mappedParticipants = (participants || []).map((p) => ({
        id: p.id,
        usn: p.usn,
        name: p.name,
        pinHash: p.pin_hash,
        avatar: p.avatar || '👾',
        coins: Number(p.coins || 0),
        registeredAt: p.created_at,
      }));

      // Map games
      const mappedGames = (games || []).map((g) => ({
        id: g.id,
        name: g.name,
        cost: Number(g.cost || 0),
        defaultPoints: g.default_points !== undefined && g.default_points !== null ? Number(g.default_points) : 10,
        isActive: Boolean(g.is_active),
      }));

      // Map score transactions
      const mappedScoreTxs = (scoreTxs || []).map((s) => ({
        id: s.id,
        eventId: s.event_id || null,
        participantId: s.participant_id,
        gameId: s.game_id,
        pointsDelta: Number(s.points_delta || 0),
        note: s.note || '',
        admin: s.admin || 'System',
        metadata: s.metadata || {},
        timestamp: s.timestamp,
      }));

      // Map coin transactions
      const mappedCoinTxs = (coinTxs || []).map((c) => ({
        id: c.id,
        participantId: c.participant_id,
        participantName: c.participant_name,
        gameId: c.game_id,
        gameName: c.game_name,
        amountDelta: Number(c.amount_delta || 0),
        newBalance: Number(c.new_balance || 0),
        type: c.type,
        reason: c.reason,
        admin: c.admin,
        timestamp: c.timestamp,
      }));

      // Map system settings
      let startingCoins = 5;
      if (Array.isArray(settingsRows)) {
        const row = settingsRows.find((r) => r.key === 'startingCoins');
        if (row && row.value && typeof row.value.amount === 'number') {
          startingCoins = row.value.amount;
        }
      }

      return {
        participants: mappedParticipants,
        games: mappedGames,
        transactions: mappedScoreTxs,
        coinTransactions: mappedCoinTxs,
        settings: {
          startingCoins,
          lastUpdated: new Date().toISOString(),
        },
      };
    } catch (err) {
      console.warn('[dbService] Exception loading data from Supabase:', err.message);
      return null;
    }
  },

  /**
   * Persists or updates a participant in Supabase.
   */
  async saveParticipant(participant) {
    if (!supabase || !participant) return;
    try {
      await supabase.from('participants').upsert(
        {
          id: participant.id,
          usn: (participant.usn || '').trim().toUpperCase(),
          name: participant.name,
          pin_hash: participant.pinHash,
          avatar: participant.avatar || '👾',
          coins: Number(participant.coins || 0),
          created_at: participant.registeredAt || new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    } catch (e) {
      console.warn('[dbService] saveParticipant error:', e);
    }
  },

  /**
   * Deletes a participant from Supabase.
   */
  async deleteParticipant(participantId) {
    if (!supabase || !participantId) return;
    try {
      await supabase.from('participants').delete().eq('id', participantId);
    } catch (e) {
      console.warn('[dbService] deleteParticipant error:', e);
    }
  },

  /**
   * Persists or updates a game in Supabase.
   */
  async saveGame(game) {
    if (!supabase || !game) return;
    try {
      await supabase.from('games').upsert(
        {
          id: game.id,
          name: game.name,
          cost: Number(game.cost || 0),
          default_points: game.defaultPoints !== undefined && game.defaultPoints !== null ? Number(game.defaultPoints) : 10,
          is_active: Boolean(game.isActive),
        },
        { onConflict: 'id' }
      );
    } catch (e) {
      console.warn('[dbService] saveGame error:', e);
    }
  },

  /**
   * Deletes a game from Supabase.
   */
  async deleteGame(gameId) {
    if (!supabase || !gameId) return;
    try {
      await supabase.from('games').delete().eq('id', gameId);
    } catch (e) {
      console.warn('[dbService] deleteGame error:', e);
    }
  },

  /**
   * Inserts a score transaction in Supabase.
   */
  async saveScoreTransaction(tx) {
    if (!supabase || !tx) return;
    try {
      await supabase.from('score_transactions').insert({
        id: tx.id,
        event_id: tx.eventId || null,
        participant_id: tx.participantId,
        game_id: tx.gameId,
        points_delta: Number(tx.pointsDelta || 0),
        note: tx.note || '',
        admin: tx.admin || 'Admin Operator',
        metadata: tx.metadata || {},
        timestamp: tx.timestamp || new Date().toISOString(),
      });
    } catch (e) {
      console.warn('[dbService] saveScoreTransaction error:', e);
    }
  },

  /**
   * Rolls back a score transaction from Supabase.
   */
  async deleteScoreTransaction(txId) {
    if (!supabase || !txId) return;
    try {
      await supabase.from('score_transactions').delete().eq('id', txId);
    } catch (e) {
      console.warn('[dbService] deleteScoreTransaction error:', e);
    }
  },

  /**
   * Inserts a coin transaction in Supabase.
   */
  async saveCoinTransaction(tx) {
    if (!supabase || !tx) return;
    try {
      await supabase.from('coin_transactions').insert({
        id: tx.id,
        participant_id: tx.participantId,
        participant_name: tx.participantName,
        game_id: tx.gameId || null,
        game_name: tx.gameName || null,
        amount_delta: Number(tx.amountDelta || 0),
        new_balance: Number(tx.newBalance || 0),
        type: tx.type,
        reason: tx.reason || '',
        admin: tx.admin || 'System',
        timestamp: tx.timestamp || new Date().toISOString(),
      });
    } catch (e) {
      console.warn('[dbService] saveCoinTransaction error:', e);
    }
  },

  /**
   * Saves system starting coins setting in Supabase.
   */
  async saveStartingCoinsSetting(amount) {
    if (!supabase) return;
    try {
      await supabase.from('system_settings').upsert(
        {
          key: 'startingCoins',
          value: { amount: Number(amount || 0) },
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
    } catch (e) {
      console.warn('[dbService] saveStartingCoinsSetting error:', e);
    }
  },
};
