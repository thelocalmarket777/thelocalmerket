import { useState, useEffect } from 'react';
import { Camera, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslations } from '@/lib/translationControl';

import { BusinnessConnectionRequest } from '@/types';


export default function ProductSubmissionForm() {
  const { t, lang, toggle } = useTranslations();
  const [formData, setFormData] = useState<BusinnessConnectionRequest | null>({
    sellerType: '', 
    companyName: '', 
    panNumber: '',
    productName: '', 
    productDescription: '', 
    productCategory: '', 
    cost: '', 
    suggestedRetailPrice: '', 
    commissionRate: '', 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    address: '', 
    city: '', 
    state: '', 
    zip: '', 
    termsAccepted: false
  });
const [formErrors, setFormErrors] = useState<Partial<Record<keyof BusinnessConnectionRequest, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    seller: true,
    product: true,
    pricing: true,
    contact: true
  });

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      setFormData(prev => ({ 
        ...prev, 
        firstName: user.firstName || '', 
        lastName: user.lastName || '', 
        email: user.email || '', 
        phone: user.phone || '' 
      }));
    } catch(error) {
        console.error('error at form bussine plan',error)
    }
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };
const validate = (): Partial<Record<keyof BusinnessConnectionRequest, string>> => {
    const errs: Partial<Record<keyof BusinnessConnectionRequest, string>> = {};

    // Required fields validation
    const requiredFields = ['sellerType', 'productName', 'productDescription', 'cost', 'firstName', 'lastName', 'email', 'phone'] as const;
    requiredFields.forEach(field => {
        if (!formData[field]?.trim()) errs[field] = t.required;
    });

    // Manufacturer-specific validations
    if (formData.sellerType === 'manufacturer') {
        ['companyName', 'panNumber'].forEach(field => {
            if (!formData[field]?.trim()) errs[field] = t.required;
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
        errs.email = t.invalidEmail;
    }

    // Numeric validations
    const numericFields = ['cost', 'suggestedRetailPrice', 'commissionRate'] as const;
    numericFields.forEach(field => {
        if (formData[field] && (isNaN(+formData[field]) || +formData[field] <= 0)) {
            errs[field] = t.invalidNumber;
        }
    });

    // Terms acceptance
    if (!formData.termsAccepted) {
        errs.termsAccepted = t.termsRequired;
    }

    return errs;
};

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setFormErrors(errs);
    setSubmitted(true);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg p-10">
        <div className="bg-green-50 rounded-full p-4 mb-6">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>
        <h2 className="text-3xl font-semibold mb-4 text-center">{t.successTitle}</h2>
        <p className="text-gray-600 mb-8 text-center max-w-lg">{t.successMessage}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-300 focus:outline-none"
        >
          {t.submitAnother}
        </button>
      </div>
    );
  }

  const renderFormField = (name:string, label:string, type = "text", options = null) => {
    const isRequired = ['sellerType', 'productName', 'productDescription', 'cost', 'firstName', 'lastName', 'email', 'phone'].includes(name) ||
                      (name === 'companyName' && formData.sellerType === 'manufacturer') ||
                      (name === 'panNumber' && formData.sellerType === 'manufacturer');
    return (
      <div className="w-full">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        {type === 'select' ? (
          <select 
            name={name} 
            value={formData[name]} 
            onChange={handleChange}
            className={`w-full rounded-lg border ${formErrors[name] ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea 
            name={name} 
            value={formData[name]} 
            onChange={handleChange}
            rows="4" 
            className={`w-full rounded-lg border ${formErrors[name] ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
          />
        ) : (
          <input 
            type={type} 
            name={name} 
            value={formData[name]} 
            onChange={handleChange}
            className={`w-full rounded-lg border ${formErrors[name] ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
          />
        )}
        {formErrors[name] && (
          <p className="text-red-500 text-sm mt-1">{formErrors[name]}</p>
        )}
      </div>
    );
  };

const renderSection = (title: string, sectionKey: keyof typeof expandedSections, content: React.ReactNode) => {
    return (
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <button 
          type="button"
          onClick={() => toggleSection(sectionKey)}
          className="flex justify-between items-center w-full px-6 py-4 text-left bg-gradient-to-r from-blue-50 to-white"
        >
          <h2 className="text-xl font-semibold text-blue-800 flex items-center">
            {expandedSections[sectionKey] ? <ChevronDown className="w-5 h-5 mr-2" /> : <ChevronRight className="w-5 h-5 mr-2" />}
            {title}
          </h2>
        </button>
        {expandedSections[sectionKey] && (
          <div className="p-6">{content}</div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-8 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t.title}</h1>
          <button 
            onClick={toggle} 
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 uppercase text-sm"
          >
            {lang === 'english' ? t.switchToNepali : t.switchToEnglish}
          </button>
        </div>
        <p className="text-blue-100 mt-3 max-w-2xl">{t.subtitle}</p>
      </div>
      
      <div className="space-y-6">
        {/* Seller Info Section */}
        {renderSection(t.sellerInfo, 'seller', (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFormField('sellerType', t.sellerType, 'select', [
                { value: '', label: '--' },
                { value: 'manufacturer', label: t.manufacturer },
                { value: 'individual', label: t.individual }
              ])}
            </div>
            
            {formData.sellerType === 'manufacturer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {renderFormField('companyName', t.companyName)}
                {renderFormField('panNumber', t.panNumber)}
              </div>
            )}
          </div>
        ))}

        {/* Product Details Section */}
        {renderSection(t.productDetails, 'product', (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFormField('productName', t.productName)}
              {renderFormField('productCategory', t.productCategory, 'select', [
                { value: '', label: t.categories.select },
                ...Object.entries(t.categories)
                  .filter(([k]) => k !== 'select')
                  .map(([key, label]) => ({ value: key, label }))
              ])}
            </div>
            
            {renderFormField('productDescription', t.productDescription, 'textarea')}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.productImage}</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="bg-blue-100 rounded-full p-3 mb-3">
                  <Camera className="h-8 w-8 text-blue-600" />
                </div>
                <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors">
                  {t.uploadImage}
                  <input type="file" name="productImage" className="hidden" accept="image/*" />
                </label>
                <p className="text-xs text-gray-500 mt-2">{t.imageFormat}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Pricing Info Section */}
        {renderSection(t.pricingInfo, 'pricing', (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderFormField('cost', t.cost)}
            {renderFormField('suggestedRetailPrice', t.retailPrice)}
            {renderFormField('commissionRate', t.commission)}
          </div>
        ))}

        {/* Contact Info Section */}
        {renderSection(t.contactInfo, 'contact', (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFormField('firstName', t.firstName)}
              {renderFormField('lastName', t.lastName)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFormField('email', t.email, 'email')}
              {renderFormField('phone', t.phone, 'tel')}
            </div>
            <div>
              {renderFormField('address', t.address)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {renderFormField('city', t.city)}
              {renderFormField('state', t.state)}
              {renderFormField('zip', t.zip)}
            </div>
            
            <div className="mt-6">
              <label className={`flex items-start ${formErrors.termsAccepted ? 'text-red-500' : 'text-gray-700'}`}>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">{t.termsLabel}</span>
              </label>
              {formErrors.termsAccepted && (
                <p className="text-red-500 text-sm mt-1">{formErrors.termsAccepted}</p>
              )}
            </div>
          </div>
        ))}

        <div className="pt-6 flex justify-center">
          <button 
            onClick={handleSubmit}
            type="button" 
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transform hover:-translate-y-0.5"
          >
            {t.submitButton}
          </button>
        </div>
      </div>
    </div>
  );
}