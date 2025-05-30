import React from 'react';
import styles from './LegalPages.module.css';

const TermsAndConditions = () => (
  <div className={styles.legalContainer}>
    <h1>Terms &amp; Conditions</h1>
    <p>
      Welcome to BetInfo.Live. By accessing or using our website and services, you agree to the following Terms &amp; Conditions.
    </p>
    <ol className={styles.legalList}>
      <li>
        <strong>Eligibility:</strong>
        <ul>
          <li>You must be at least 18 years old or of legal gambling age in your jurisdiction to use BetInfo.Live.</li>
        </ul>
      </li>
      <li>
        <strong>Service Nature:</strong>
        <ul>
          <li>BetInfo.Live is a sports insights and tips platform. We do not operate or facilitate betting/gambling. All information is for entertainment and informational purposes only.</li>
          <li>We do not guarantee the accuracy, completeness, or timeliness of any data or tips provided.</li>
        </ul>
      </li>
      <li>
        <strong>User Responsibility:</strong>
        <ul>
          <li>You are solely responsible for your betting decisions. Use all information at your own risk.</li>
          <li>You must ensure that sports betting is legal in your jurisdiction before using our insights.</li>
        </ul>
      </li>
      <li>
        <strong>Account Security:</strong>
        <ul>
          <li>You are responsible for maintaining the confidentiality of your account information and for all activities under your account.</li>
        </ul>
      </li>
      <li>
        <strong>Updates and Modifications:</strong>
        <ul>
          <li>We may modify these Terms &amp; Conditions at any time. Continued use of BetInfo.Live constitutes acceptance of the updated terms.</li>
        </ul>
      </li>
      <li>
        <strong>Intellectual Property:</strong>
        <ul>
          <li>All content, including text, graphics, logos, and software, is the property of BetInfo.Live or its licensors. You may not copy, reproduce, or distribute any content without permission.</li>
        </ul>
      </li>
      <li>
        <strong>Limitation of Liability:</strong>
        <ul>
          <li>BetInfo.Live is not liable for any loss or damages arising from use of our platform, including losses from betting activities.</li>
        </ul>
      </li>
      <li>
        <strong>Termination:</strong>
        <ul>
          <li>We reserve the right to terminate your access at any time, for any reason, without notice.</li>
        </ul>
      </li>
    </ol>
    <p>
      By using BetInfo.Live, you confirm that you have read, understood, and agree to these Terms &amp; Conditions.
    </p>
    <p className={styles.legalFooter}>
      If you have questions about these Terms, please contact us at <a href="mailto:support@betinfo.live">support@betinfo.live</a>.
    </p>
  </div>
);

export default TermsAndConditions;
