import { useTheme } from '@/contexts/ThemeContext';

const TermsAndConditions = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 shadow-sm`}>
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using this sales management platform, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
              <p className="leading-relaxed mb-3">
                Permission is granted to temporarily use this platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose</li>
                <li>attempt to reverse engineer any software</li>
                <li>remove any copyright or other proprietary notations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Data and Privacy</h2>
              <p className="leading-relaxed">
                We respect your privacy and are committed to protecting your personal data. All customer information, lead data, and business information entered into this platform remains your property and is protected according to our privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Account Security</h2>
              <p className="leading-relaxed">
                Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. You must notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Service Availability</h2>
              <p className="leading-relaxed">
                While we strive to provide continuous service, we do not guarantee that the platform will be available at all times. Scheduled maintenance, updates, and unforeseen technical issues may result in temporary unavailability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="leading-relaxed">
                In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use this platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Modifications</h2>
              <p className="leading-relaxed">
                We may revise these terms of service at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Contact Information</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at support@salesbuddy.com
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;