import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

const PrivacyPolicy = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen px-6 py-10 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          At <strong>Your Company Name</strong>, we are committed to protecting
          your privacy. This Privacy Policy outlines how we collect, use, and
          safeguard your personal information when you use our platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Your name, email address, phone number, and company details</li>
          <li>Lead data you provide for analysis and management</li>
          <li>Usage data including browser type, pages visited, and activity logs</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>To provide and maintain our services</li>
          <li>To improve platform features and user experience</li>
          <li>To communicate updates, offers, and support</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2">3. Data Security</h2>
        <p className="mb-4">
          We take appropriate security measures to protect your personal
          information against unauthorized access, alteration, disclosure, or
          destruction. However, no method of transmission over the Internet is
          100% secure.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Sharing of Information</h2>
        <p className="mb-4">
          We do not sell or rent your personal information. We may share data
          with trusted third-party services that help us operate and improve our
          platform, under strict confidentiality agreements.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">5. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, update, or delete your personal data at
          any time. Contact us if you'd like to exercise these rights.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">6. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this policy from time to time. We’ll notify you of
          changes by updating the policy date or via in-app notifications.
        </p>

        <p className="mt-8 text-sm">
          Last updated: July 16, 2025
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
