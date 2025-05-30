import React from 'react';
import styles from './LegalPages.module.css';

const Disclaimer = () => (
  <div className={styles.legalContainer}>
    <h1>Disclaimer</h1>
    <p>
      BetInfo.Live provides independent sports insights, tips, and analysis for entertainment and informational purposes only. We do not accept or facilitate bets, and are not a betting or gambling operator.
    </p>
    <ul className={styles.legalList}>
      <li>
        <strong>No Guarantee:</strong> We do not guarantee the accuracy, completeness, or results of any predictions or strategies. Past performance is not indicative of future results.
      </li>
      <li>
        <strong>Personal Responsibility:</strong> Betting involves risk. You may lose some or all of your stake. Any decisions made based on BetInfo.Live information are your sole responsibility.
      </li>
      <li>
        <strong>Legal Compliance:</strong> Users must ensure sports betting is legal in their jurisdiction before using BetInfo.Live insights.
      </li>
      <li>
        <strong>No Liability:</strong> BetInfo.Live is not liable for financial loss, damages, or consequences arising from your use of our platform or services.
      </li>
      <li>
        <strong>Responsible Use:</strong> We encourage responsible betting and advise users to bet within their means.
      </li>
    </ul>
    <p>
      By accessing or using BetInfo.Live, you acknowledge and accept this Disclaimer.
    </p>
    <p className={styles.legalFooter}>
      For questions, contact <a href="mailto:support@betinfo.live">support@betinfo.live</a>.
    </p>
  </div>
);

export default Disclaimer;
