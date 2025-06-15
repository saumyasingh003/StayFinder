import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ListingSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  location: Yup.string().required('Location is required'),
  description: Yup.string().required('Description is required'),
  pricePerNight: Yup.number().required('Price is required').min(1, 'Price must be positive'),
  images: Yup.array().min(1, 'At least one image is required'),
  availableDates: Yup.array().of(
    Yup.object().shape({
      from: Yup.date().required('From date required'),
      to: Yup.date().required('To date required').min(
        Yup.ref('from'),
        'End date must be after start date'
      ),
    })
  ).min(1, 'At least one available date is required'),
});

const ListingForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    pricePerNight: '',
    images: [],
    availableDates: [{ from: '', to: '' }],
  });

  useEffect(() => {
    if (isEdit) {
      fetchListing();
    }
  }, [id, isEdit]);

  const fetchListing = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/listings/view/${id}`);
      if (res.data.success) {
        const listing = res.data.data;
        setFormData({
          title: listing.title || '',
          location: listing.location || '',
          description: listing.description || '',
          pricePerNight: listing.pricePerNight?.toString() || '',
          images: listing.images || [],
          availableDates: listing.availableDates && listing.availableDates.length > 0
            ? listing.availableDates.map(date => ({
                from: date.from ? new Date(date.from).toISOString().split('T')[0] : '',
                to: date.to ? new Date(date.to).toISOString().split('T')[0] : ''
              }))
            : [{ from: '', to: '' }],
        });
      } else {
        toast.error('Listing not found');
        navigate('/host-dashboard');
      }
    } catch (err) {
      console.error('Error loading listing:', err);
      toast.error('Error loading listing');
      navigate('/host-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files, currentImages, setFieldValue) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const token = localStorage.getItem('token');
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await axios.post('http://localhost:8000/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        
        return response.data.imageUrl;
      });

      const imageUrls = await Promise.all(uploadPromises);
      setFieldValue('images', [...currentImages, ...imageUrls]);
      
      toast.success(`${imageUrls.length} image(s) uploaded successfully!`);
    } catch (err) {
      console.error('Error uploading images:', err);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove, currentImages, setFieldValue) => {
    const newImages = currentImages.filter((_, index) => index !== indexToRemove);
    setFieldValue('images', newImages);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login as host');
      navigate('/login');
      return;
    }

    if (values.images.length === 0) {
      toast.error('Please upload at least one image');
      setSubmitting(false);
      return;
    }

    const submitData = {
      title: values.title,
      location: values.location,
      description: values.description,
      pricePerNight: Number(values.pricePerNight),
      images: values.images,
      availableDates: values.availableDates
        .filter(date => date.from && date.to)
        .map(date => ({
          from: new Date(date.from),
          to: new Date(date.to)
        }))
    };

    try {
      if (isEdit) {
        await axios.put(`http://localhost:8000/listings/update/${id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Listing updated successfully!');
      } else {
        await axios.post('http://localhost:8000/listings/add', submitData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Listing created successfully!');
      }
      navigate('/host-dashboard');
    } catch (err) {
      console.error('Error saving listing:', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to save listing. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {isEdit ? 'Edit Your Listing' : 'Create New Listing'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Update your property details' : 'Share your space with travelers'}
            </p>
          </div>

          <Formik
            initialValues={formData}
            enableReinitialize={true}
            validationSchema={ListingSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, setFieldValue }) => (
              <Form className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="bg-rose-100 text-rose-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                      Basic Information
                    </h2>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
                    <Field 
                      name="title" 
                      placeholder="Cozy Downtown Apartment"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" 
                    />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <Field 
                      name="location" 
                      placeholder="New York, NY"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" 
                    />
                    <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <Field 
                      as="textarea" 
                      name="description" 
                      rows={4}
                      placeholder="Describe your property, amenities, and what makes it special..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors resize-none" 
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Night (₹) *</label>
                    <Field 
                      name="pricePerNight" 
                      type="number" 
                      min="1"
                      placeholder="2500"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" 
                    />
                    <ErrorMessage name="pricePerNight" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="bg-rose-100 text-rose-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                    Property Images
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">Upload images of your property</p>
                  
                  <div className="mb-6">
                    <label className="block w-full">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-rose-400 transition-colors cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files, values.images, setFieldValue)}
                          className="hidden"
                          disabled={uploading}
                        />
                        {uploading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500"></div>
                            <span className="ml-2 text-gray-600">Uploading...</span>
                          </div>
                        ) : (
                          <div>
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {values.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                      {values.images.map((imageUrl, index) => (
                        <div key={`uploaded-image-${index}-${imageUrl}`} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Property ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=Error+Loading+Image';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, values.images, setFieldValue)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <ErrorMessage name="images" component="div" className="text-red-500 text-sm mt-2" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="bg-rose-100 text-rose-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                    Available Dates
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">Set when your property is available for booking</p>
                  
                  <FieldArray name="availableDates">
                    {({ remove, push }) => (
                      <div className="space-y-4">
                        {values.availableDates && values.availableDates.map((dateRange, index) => (
                          <div key={`date-range-${index}`} className="p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                                <Field 
                                  name={`availableDates[${index}].from`} 
                                  type="date" 
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" 
                                />
                                <ErrorMessage name={`availableDates[${index}].from`} component="div" className="text-red-500 text-sm mt-1" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                                <Field 
                                  name={`availableDates[${index}].to`} 
                                  type="date" 
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" 
                                />
                                <ErrorMessage name={`availableDates[${index}].to`} component="div" className="text-red-500 text-sm mt-1" />
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-end">
                              {values.availableDates.length > 1 && (
                                <button 
                                  type="button" 
                                  onClick={() => remove(index)} 
                                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-300 rounded-lg transition-colors"
                                >
                                  Remove
                                </button>
                              )}
                              {index === values.availableDates.length - 1 && (
                                <button 
                                  type="button" 
                                  onClick={() => push({ from: '', to: '' })} 
                                  className="px-4 py-2 text-sm text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-300 rounded-lg transition-colors"
                                >
                                  Add Period
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                  <ErrorMessage name="availableDates">
                    {msg => typeof msg === 'string' ? <div className="text-red-500 text-sm mt-2">{msg}</div> : null}
                  </ErrorMessage>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={() => navigate('/host-dashboard')}
                      className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || uploading || values.images.length === 0}
                      className="w-full sm:flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {isEdit ? 'Updating...' : 'Creating...'}
                        </span>
                      ) : (
                        isEdit ? 'Update Listing' : 'Create Listing'
                      )}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ListingForm; 