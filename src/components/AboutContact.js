import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const AboutContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, you would send this data to your backend
    console.log('Form submitted:', formData);
    // For now, just show a success message
    setIsSubmitted(true);
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <Helmet>
        <title>About Us & Contact | Herd Game</title>
        <meta name="description" content="Learn about the team behind Herd Game and get in touch with us. We'd love to hear your feedback about our online multiplayer game!" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        {/* About Us Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8 mb-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">About Us</h1>
            <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium">
              Return Home
            </Link>
          </div>
          
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg mb-4">
              Welcome to Herd Game, the online multiplayer game where thinking like the herd is the key to victory!
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">Our Story</h2>
            <p>
              Herd Game was created by a small team of passionate game developers who wanted to bring the fun of party games to the online world. 
              Inspired by popular board games where players try to match answers with others, we developed a digital version that allows friends 
              to play together no matter where they are located.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">Our Mission</h2>
            <p>
              Our mission is to create engaging, accessible games that bring people together. We believe that games have the power to 
              strengthen relationships, spark conversations, and create memorable moments. With Herd Game, we aim to provide a platform 
              for friends, family, and even strangers to connect and have fun together.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">The Team</h2>
            <p>
              Behind Herd Game is a dedicated team of developers, designers, and game enthusiasts who are committed to creating the best 
              possible experience for our players. We're constantly working on improving the game, adding new features, and ensuring 
              that Herd Game remains a fun and safe space for everyone.
            </p>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 mb-4">
                We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, 
                feel free to reach out to us using the form or the contact information below.
              </p>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
                <p className="text-gray-700">
                  <a href="mailto:ajejey@gmail.com" className="text-purple-600 hover:text-purple-800">
                    ajejey@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContact;
