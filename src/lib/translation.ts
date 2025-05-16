// src/translations.ts

export type Language = 'english' | 'nepali';

export interface CategoryTranslations {
  select: string;
  electronics: string;
  clothing: string;
  home: string;
  beauty: string;
  toys: string;
  books: string;
  food: string;
  other: string;
}

export interface TranslationStrings {
  title: string;
  subtitle: string;
  sellerInfo: string;
  sellerType: string;
  manufacturer: string;
  individual: string;
  companyName: string;
  panNumber: string;
  productDetails: string;
  productName: string;
  productDescription: string;
  productCategory: string;
  productImage: string;
  uploadImage: string;
  imageFormat: string;
  pricingInfo: string;
  cost: string;
  retailPrice: string;
  commission: string;
  contactInfo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  termsLabel: string;
  submitButton: string;
  previewButton: string;
  successTitle: string;
  successMessage: string;
  submitAnother: string;
  categories: CategoryTranslations;
  preview: string;
  closePreview: string;
  required: string;
  switchToNepali?: string;
  switchToEnglish?: string;
  providePanNumber: string;
  termsAccepted?:boolean
}

export type Translations = Record<Language, TranslationStrings>;

export const translations: Translations = {
  english: {
    title: "Product Submission Form",
    subtitle: "Complete this form to submit your product for consideration. Our team will review your submission and contact you regarding the next steps.",
    sellerInfo: "Seller Information",
    sellerType: "Are you a manufacturer or individual seller?",
    manufacturer: "Manufacturer",
    individual: "Individual Seller",
    companyName: "Company Name",
    panNumber: "PAN/Registration Number",
    productDetails: "Product Details",
    productName: "Product Name",
    productDescription: "Product Description",
    productCategory: "Product Category",
    productImage: "Product Image",
    uploadImage: "Upload Image",
    imageFormat: "PNG, JPG, GIF up to 5MB",
    pricingInfo: "Pricing Information",
    cost: "Cost (Wholesale Price)",
    retailPrice: "Suggested Retail Price",
    commission: "Commission Rate You're Willing to Offer (%)",
    contactInfo: "Contact Information",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone Number",
    address: "Address",
    city: "City",
    state: "State/Province",
    zip: "Zip/Postal Code",
    termsLabel: "I agree to the Terms and Conditions and Privacy Policy",
    submitButton: "Submit Product",
    previewButton: "Preview Product",
    successTitle: "Product Submission Successful!",
    successMessage: "Thank you for submitting your product. Our team will review your information and get back to you shortly.",
    submitAnother: "Submit Another Product",
    categories: {
      select: "Select a Category",
      electronics: "Electronics",
      clothing: "Clothing & Apparel",
      home: "Home & Garden",
      beauty: "Beauty & Personal Care",
      toys: "Toys & Games",
      books: "Books & Media",
      food: "Food & Beverages",
      other: "Other"
    },
    preview: "Product Preview",
    closePreview: "Close Preview",
    required: "required",
    switchToNepali: "नेपालीमा हेर्नुहोस्",
    providePanNumber: "Please provide PAN/Registration Number"
  },
  nepali: {
    title: "उत्पादन दर्ता फारम",
    subtitle: "आफ्नो उत्पादन पेश गर्न यो फारम भर्नुहोस्। हाम्रो टोलीले तपाईंको उत्पादन समीक्षा गर्नेछ र अर्को चरणहरूको बारेमा तपाईंलाई सम्पर्क गर्नेछ।",
    sellerInfo: "विक्रेता जानकारी",
    sellerType: "के तपाईं निर्माता वा व्यक्तिगत विक्रेता हुनुहुन्छ?",
    manufacturer: "निर्माता",
    individual: "व्यक्तिगत विक्रेता",
    companyName: "कम्पनीको नाम",
    panNumber: "प्यान/दर्ता नम्बर",
    productDetails: "उत्पादन विवरण",
    productName: "उत्पादनको नाम",
    productDescription: "उत्पादनको विवरण",
    productCategory: "उत्पादन श्रेणी",
    productImage: "उत्पादनको तस्बिर",
    uploadImage: "तस्बिर अपलोड गर्नुहोस्",
    imageFormat: "PNG, JPG, GIF 5MB सम्म",
    pricingInfo: "मूल्य जानकारी",
    cost: "लागत (होलसेल मूल्य)",
    retailPrice: "सुझाव गरिएको खुद्रा मूल्य",
    commission: "दिन चाहने कमिशन दर (%)",
    contactInfo: "सम्पर्क जानकारी",
    firstName: "पहिलो नाम",
    lastName: "थर",
    email: "इमेल",
    phone: "फोन नम्बर",
    address: "ठेगाना",
    city: "शहर",
    state: "प्रदेश",
    zip: "जिप/पोस्टल कोड",
    termsLabel: "म नियम र सर्तहरू र गोपनीयता नीतिमा सहमत छु",
    submitButton: "उत्पादन पेश गर्नुहोस्",
    previewButton: "उत्पादन पूर्वावलोकन",
    successTitle: "उत्पादन सफलतापूर्वक पेश गरियो!",
    successMessage: "तपाईंको उत्पादन पेश गर्नुभएकोमा धन्यवाद। हाम्रो टोलीले तपाईंको जानकारी समीक्षा गर्नेछ र चाँडै तपाईंलाई सम्पर्क गर्नेछ।",
    submitAnother: "अर्को उत्पादन पेश गर्नुहोस्",
    categories: {
      select: "एउटा श्रेणी छान्नुहोस्",
      electronics: "इलेक्ट्रोनिक्स",
      clothing: "कपडा र पोशाक",
      home: "घर र बगैंचा",
      beauty: "सौन्दर्य र व्यक्तिगत हेरचाह",
      toys: "खेलौना र खेलहरू",
      books: "किताब र मिडिया",
      food: "खाद्य र पेय पदार्थ",
      other: "अन्य"
    },
    preview: "उत्पादन पूर्वावलोकन",
    closePreview: "पूर्वावलोकन बन्द गर्नुहोस्",
    required: "आवश्यक",
    switchToEnglish: "View in English",
    providePanNumber: "कृपया प्यान/दर्ता नम्बर प्रदान गर्नुहोस्"
  }
};
