import React from 'react';
import ParticipantAuthScreen from './ParticipantAuthScreen';

/**
 * ParticipantRegistration (Compatibility forwarder)
 * Redirects legacy references to the single canonical ParticipantAuthScreen component.
 * Prevents duplicate participant authentication forms.
 */
export default function ParticipantRegistration({
  onRegisterParticipant,
  onParticipantLogin,
  startingCoins = 5,
  registeredList = [],
  triggerCelebration,
}) {
  return (
    <ParticipantAuthScreen
      startingCoins={startingCoins}
      registeredParticipants={registeredList}
      triggerCelebration={triggerCelebration}
      onAuthSuccess={(participant, session, isNew) => {
        if (isNew && onRegisterParticipant) {
          onRegisterParticipant(participant);
        } else if (!isNew && onParticipantLogin) {
          onParticipantLogin(participant);
        }
      }}
    />
  );
}
