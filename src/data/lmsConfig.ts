import type { LmsConfig } from "@/types/lms";

export const lmsConfig: LmsConfig = {
  platformName: "Get Techy With Lucky LMS",
  brandName: "Tech Pulse Insider",
  supportEmail: "lucky@nakolaexpertsystems.com",
  supportPhone: "+254715674828",
  whatsappCommunityLink: "https://wa.me/254715674828",
  payment: {
    methodName: "KCB Bank Paybill",
    paybillNumber: "522522",
    accountNumber: "1315657899",
    accountName: "LUCKY LOONKISHU NAKOLA",
    currency: "KES",
    instructionSteps: [
      "Go to M-Pesa",
      "Select Lipa na M-Pesa",
      "Select Paybill",
      "Enter KCB Bank Paybill Number: 522522",
      "Enter Account Number: 1315657899",
      "Enter Amount: [COURSE_PRICE]",
      "Complete payment",
      "Submit your M-Pesa transaction code in the LMS form",
    ],
  },
  featureFlags: {
    useSupabaseProvider: true,
    enableCertificates: false,
    enableEmailNotifications: false,
    enableLiveClasses: false,
  },
};

export const formatKesAmount = (amount: number): string => {
  return `KES ${amount.toLocaleString("en-KE")}`;
};
