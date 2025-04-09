import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onGoogleLogin, isLoading = false }) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6">
        <GoogleLogin
          onSuccess={onGoogleLogin}  // Handles the success (received the Google token)
          onError={() => alert('Login Failed')} // Handles errors during the login process
          useOneTap  // Optional: Enable the One Tap feature
          size="large"  // You can adjust the button size as needed
        />
      </div>
    </div>
  );
};

export default GoogleLoginButton;