import React, { useState } from "react";
import '../stylesheets/consent.css'

export default function PrivacyPolicyModal({ onClose, onConsent }) {
  const [consentGiven, setConsentGiven] = useState(false);

  const handleConsentChange = (event) => {
    setConsentGiven(event.target.checked);
  };

  const handleConfirm = () => {
    if (consentGiven) {
      onConsent();
      onClose();
    }
  };

  return (
    <div className="privacy-policy-modal">
      <h2>Privacy Policy</h2>
      <p>
        We value your privacy and are committed to protecting your personal
        information. When you use our weather app, we collect your IP address
        to determine your approximate location. This information is used solely
        to provide you with accurate weather data for your area.
      </p>

      <label>
        <input
          type="checkbox"
          checked={consentGiven}
          onChange={handleConsentChange}
        />
        I have read and agree to the privacy policy.
      </label>

      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
