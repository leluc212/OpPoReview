// Google Maps Geocoding Service
// Chuyển đổi địa chỉ thành tọa độ GPS và ngược lại

class GeocodingService {
  constructor() {
    // Sử dụng Google Maps Geocoding API
    // Bạn cần thay thế YOUR_API_KEY bằng API key thực tế
    this.apiKey = (typeof process !== 'undefined' && process.env?.REACT_APP_GOOGLE_MAPS_API_KEY) || 'YOUR_API_KEY';
    this.baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    
    console.log('🗺️ GeocodingService initialized');
    
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY') {
      console.warn('⚠️ Google Maps API key not configured. Please set REACT_APP_GOOGLE_MAPS_API_KEY in .env file');
    }
  }

  /**
   * Chuyển đổi địa chỉ thành tọa độ GPS (Geocoding)
   * @param {string} address - Địa chỉ cần chuyển đổi
   * @returns {Promise<Object>} - {lat, lng, formattedAddress, components}
   */
  async geocodeAddress(address) {
    if (!address || !address.trim()) {
      throw new Error('Địa chỉ không được để trống');
    }

    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY') {
      throw new Error('Google Maps API key chưa được cấu hình');
    }

    try {
      console.log('🔍 Geocoding address:', address);
      
      const url = `${this.baseUrl}?address=${encodeURIComponent(address)}&key=${this.apiKey}&region=vn&language=vi`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0];
        const location = result.geometry.location;
        
        const geocodeResult = {
          lat: location.lat,
          lng: location.lng,
          formattedAddress: result.formatted_address,
          components: this.parseAddressComponents(result.address_components),
          placeId: result.place_id,
          types: result.types
        };

        console.log('✅ Geocoding successful:', geocodeResult);
        return geocodeResult;
      } else {
        console.error('❌ Geocoding failed:', data.status, data.error_message);
        throw new Error(this.getErrorMessage(data.status));
      }
    } catch (error) {
      console.error('❌ Geocoding error:', error);
      throw error;
    }
  }

  /**
   * Chuyển đổi tọa độ GPS thành địa chỉ (Reverse Geocoding)
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} - {address, components}
   */
  async reverseGeocode(lat, lng) {
    if (!lat || !lng) {
      throw new Error('Tọa độ không hợp lệ');
    }

    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY') {
      throw new Error('Google Maps API key chưa được cấu hình');
    }

    try {
      console.log('🔍 Reverse geocoding:', lat, lng);
      
      const url = `${this.baseUrl}?latlng=${lat},${lng}&key=${this.apiKey}&region=vn&language=vi`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0];
        
        const reverseResult = {
          address: result.formatted_address,
          components: this.parseAddressComponents(result.address_components),
          placeId: result.place_id,
          types: result.types
        };

        console.log('✅ Reverse geocoding successful:', reverseResult);
        return reverseResult;
      } else {
        console.error('❌ Reverse geocoding failed:', data.status, data.error_message);
        throw new Error(this.getErrorMessage(data.status));
      }
    } catch (error) {
      console.error('❌ Reverse geocoding error:', error);
      throw error;
    }
  }

  /**
   * Tìm kiếm địa điểm với gợi ý (Places Autocomplete)
   * @param {string} input - Từ khóa tìm kiếm
   * @returns {Promise<Array>} - Danh sách gợi ý địa điểm
   */
  async searchPlaces(input) {
    if (!input || !input.trim()) {
      return [];
    }

    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY') {
      throw new Error('Google Maps API key chưa được cấu hình');
    }

    try {
      console.log('🔍 Searching places:', input);
      
      // Sử dụng Places API Autocomplete
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${this.apiKey}&region=vn&language=vi&components=country:vn`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.predictions) {
        const suggestions = data.predictions.map(prediction => ({
          description: prediction.description,
          placeId: prediction.place_id,
          types: prediction.types,
          terms: prediction.terms
        }));

        console.log('✅ Places search successful:', suggestions.length, 'results');
        return suggestions;
      } else {
        console.error('❌ Places search failed:', data.status, data.error_message);
        return [];
      }
    } catch (error) {
      console.error('❌ Places search error:', error);
      return [];
    }
  }

  /**
   * Lấy chi tiết địa điểm từ Place ID
   * @param {string} placeId - Place ID từ Google Places
   * @returns {Promise<Object>} - Chi tiết địa điểm
   */
  async getPlaceDetails(placeId) {
    if (!placeId) {
      throw new Error('Place ID không hợp lệ');
    }

    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY') {
      throw new Error('Google Maps API key chưa được cấu hình');
    }

    try {
      console.log('🔍 Getting place details:', placeId);
      
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.apiKey}&language=vi&fields=geometry,formatted_address,address_components,name,types`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const result = data.result;
        const location = result.geometry.location;
        
        const placeDetails = {
          lat: location.lat,
          lng: location.lng,
          name: result.name,
          formattedAddress: result.formatted_address,
          components: this.parseAddressComponents(result.address_components),
          types: result.types
        };

        console.log('✅ Place details successful:', placeDetails);
        return placeDetails;
      } else {
        console.error('❌ Place details failed:', data.status, data.error_message);
        throw new Error(this.getErrorMessage(data.status));
      }
    } catch (error) {
      console.error('❌ Place details error:', error);
      throw error;
    }
  }

  /**
   * Parse address components từ Google Maps API
   * @param {Array} components - Address components từ API
   * @returns {Object} - Parsed components
   */
  parseAddressComponents(components) {
    const parsed = {
      streetNumber: '',
      route: '',
      ward: '',
      district: '',
      city: '',
      province: '',
      country: '',
      postalCode: ''
    };

    components.forEach(component => {
      const types = component.types;
      const longName = component.long_name;
      const shortName = component.short_name;

      if (types.includes('street_number')) {
        parsed.streetNumber = longName;
      } else if (types.includes('route')) {
        parsed.route = longName;
      } else if (types.includes('sublocality_level_1') || types.includes('ward')) {
        parsed.ward = longName;
      } else if (types.includes('administrative_area_level_2') || types.includes('sublocality')) {
        parsed.district = longName;
      } else if (types.includes('locality')) {
        parsed.city = longName;
      } else if (types.includes('administrative_area_level_1')) {
        parsed.province = longName;
      } else if (types.includes('country')) {
        parsed.country = longName;
      } else if (types.includes('postal_code')) {
        parsed.postalCode = longName;
      }
    });

    return parsed;
  }

  /**
   * Lấy thông báo lỗi dựa trên status code
   * @param {string} status - Status từ Google Maps API
   * @returns {string} - Thông báo lỗi
   */
  getErrorMessage(status) {
    const errorMessages = {
      'ZERO_RESULTS': 'Không tìm thấy địa chỉ phù hợp',
      'OVER_QUERY_LIMIT': 'Đã vượt quá giới hạn truy vấn API',
      'REQUEST_DENIED': 'Yêu cầu bị từ chối - kiểm tra API key',
      'INVALID_REQUEST': 'Yêu cầu không hợp lệ',
      'UNKNOWN_ERROR': 'Lỗi không xác định từ server'
    };

    return errorMessages[status] || `Lỗi API: ${status}`;
  }

  /**
   * Kiểm tra xem API key có được cấu hình không
   * @returns {boolean}
   */
  isConfigured() {
    return this.apiKey && this.apiKey !== 'YOUR_API_KEY';
  }

  /**
   * Validate tọa độ GPS
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean}
   */
  isValidCoordinates(lat, lng) {
    return (
      typeof lat === 'number' && 
      typeof lng === 'number' &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180
    );
  }

  /**
   * Format địa chỉ cho Việt Nam
   * @param {Object} components - Address components
   * @returns {string} - Formatted address
   */
  formatVietnameseAddress(components) {
    const parts = [];
    
    if (components.streetNumber && components.route) {
      parts.push(`${components.streetNumber} ${components.route}`);
    } else if (components.route) {
      parts.push(components.route);
    }
    
    if (components.ward) {
      parts.push(components.ward);
    }
    
    if (components.district) {
      parts.push(components.district);
    }
    
    if (components.city || components.province) {
      parts.push(components.city || components.province);
    }

    return parts.join(', ');
  }
}

// Export singleton instance
const geocodingService = new GeocodingService();
export default geocodingService;