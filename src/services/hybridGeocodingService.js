// Hybrid Geocoding Service
// Tự động chuyển đổi giữa Google Maps và OpenStreetMap

class HybridGeocodingService {
  constructor() {
    this.googleService = null;
    this.osmService = null;
    this.preferredService = 'auto'; // 'google', 'osm', 'auto'
    
    console.log('🔄 HybridGeocodingService initialized');
    
    // Load services lazily
    this.loadServices();
  }

  async loadServices() {
    try {
      // Load Google Maps service
      const googleModule = await import('./geocodingService');
      this.googleService = googleModule.default;
      
      // Load OpenStreetMap service
      const osmModule = await import('./openStreetMapService');
      this.osmService = osmModule.default;
      
      console.log('✅ Both geocoding services loaded');
    } catch (error) {
      console.error('❌ Error loading geocoding services:', error);
    }
  }

  /**
   * Chọn service tốt nhất để sử dụng
   * @returns {Object} - Service object
   */
  getBestService() {
    // Nếu chỉ định service cụ thể
    if (this.preferredService === 'google' && this.googleService?.isConfigured()) {
      return { service: this.googleService, name: 'Google Maps' };
    }
    
    if (this.preferredService === 'osm' && this.osmService?.isConfigured()) {
      return { service: this.osmService, name: 'OpenStreetMap' };
    }
    
    // Auto mode: ưu tiên Google nếu có API key
    if (this.googleService?.isConfigured()) {
      return { service: this.googleService, name: 'Google Maps' };
    }
    
    // Fallback to OpenStreetMap (luôn available)
    if (this.osmService?.isConfigured()) {
      return { service: this.osmService, name: 'OpenStreetMap' };
    }
    
    return { service: null, name: 'None' };
  }

  /**
   * Chuyển đổi địa chỉ thành tọa độ GPS
   * @param {string} address - Địa chỉ cần chuyển đổi
   * @returns {Promise<Object>} - {lat, lng, formattedAddress, components, source}
   */
  async geocodeAddress(address) {
    const { service, name } = this.getBestService();
    
    if (!service) {
      throw new Error('Không có geocoding service nào khả dụng');
    }

    try {
      console.log(`🔍 Using ${name} for geocoding:`, address);
      const result = await service.geocodeAddress(address);
      
      return {
        ...result,
        source: name.toLowerCase().replace(' ', '_')
      };
    } catch (error) {
      console.error(`❌ ${name} geocoding failed:`, error.message);
      
      // Fallback to other service
      const fallbackService = name === 'Google Maps' ? 
        { service: this.osmService, name: 'OpenStreetMap' } :
        { service: this.googleService, name: 'Google Maps' };
      
      if (fallbackService.service?.isConfigured()) {
        console.log(`🔄 Falling back to ${fallbackService.name}`);
        try {
          const result = await fallbackService.service.geocodeAddress(address);
          return {
            ...result,
            source: fallbackService.name.toLowerCase().replace(' ', '_')
          };
        } catch (fallbackError) {
          console.error(`❌ ${fallbackService.name} fallback failed:`, fallbackError.message);
        }
      }
      
      throw error;
    }
  }

  /**
   * Chuyển đổi tọa độ GPS thành địa chỉ
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} - {address, components, source}
   */
  async reverseGeocode(lat, lng) {
    const { service, name } = this.getBestService();
    
    if (!service) {
      throw new Error('Không có geocoding service nào khả dụng');
    }

    try {
      console.log(`🔍 Using ${name} for reverse geocoding:`, lat, lng);
      const result = await service.reverseGeocode(lat, lng);
      
      return {
        ...result,
        source: name.toLowerCase().replace(' ', '_')
      };
    } catch (error) {
      console.error(`❌ ${name} reverse geocoding failed:`, error.message);
      
      // Fallback to other service
      const fallbackService = name === 'Google Maps' ? 
        { service: this.osmService, name: 'OpenStreetMap' } :
        { service: this.googleService, name: 'Google Maps' };
      
      if (fallbackService.service?.isConfigured()) {
        console.log(`🔄 Falling back to ${fallbackService.name}`);
        try {
          const result = await fallbackService.service.reverseGeocode(lat, lng);
          return {
            ...result,
            source: fallbackService.name.toLowerCase().replace(' ', '_')
          };
        } catch (fallbackError) {
          console.error(`❌ ${fallbackService.name} fallback failed:`, fallbackError.message);
        }
      }
      
      throw error;
    }
  }

  /**
   * Tìm kiếm địa điểm với gợi ý
   * @param {string} input - Từ khóa tìm kiếm
   * @returns {Promise<Array>} - Danh sách gợi ý địa điểm
   */
  async searchPlaces(input) {
    const { service, name } = this.getBestService();
    
    if (!service) {
      return [];
    }

    try {
      console.log(`🔍 Using ${name} for places search:`, input);
      const results = await service.searchPlaces(input);
      
      // Add source info to each result
      return results.map(result => ({
        ...result,
        source: name.toLowerCase().replace(' ', '_')
      }));
    } catch (error) {
      console.error(`❌ ${name} places search failed:`, error.message);
      
      // Fallback to other service
      const fallbackService = name === 'Google Maps' ? 
        { service: this.osmService, name: 'OpenStreetMap' } :
        { service: this.googleService, name: 'Google Maps' };
      
      if (fallbackService.service?.isConfigured()) {
        console.log(`🔄 Falling back to ${fallbackService.name}`);
        try {
          const results = await fallbackService.service.searchPlaces(input);
          return results.map(result => ({
            ...result,
            source: fallbackService.name.toLowerCase().replace(' ', '_')
          }));
        } catch (fallbackError) {
          console.error(`❌ ${fallbackService.name} fallback failed:`, fallbackError.message);
        }
      }
      
      return [];
    }
  }

  /**
   * Lấy chi tiết địa điểm từ Place ID (chỉ Google Maps)
   * @param {string} placeId - Place ID
   * @returns {Promise<Object>} - Chi tiết địa điểm
   */
  async getPlaceDetails(placeId) {
    if (this.googleService?.isConfigured()) {
      try {
        const result = await this.googleService.getPlaceDetails(placeId);
        return {
          ...result,
          source: 'google_maps'
        };
      } catch (error) {
        console.error('❌ Google Maps place details failed:', error.message);
        throw error;
      }
    } else {
      throw new Error('Place details chỉ khả dụng với Google Maps API');
    }
  }

  /**
   * Thiết lập service ưu tiên
   * @param {string} service - 'google', 'osm', 'auto'
   */
  setPreferredService(service) {
    if (['google', 'osm', 'auto'].includes(service)) {
      this.preferredService = service;
      console.log(`🔧 Preferred service set to: ${service}`);
    } else {
      console.error('❌ Invalid service. Use: google, osm, auto');
    }
  }

  /**
   * Kiểm tra service có sẵn sàng không
   * @returns {boolean}
   */
  isConfigured() {
    const { service } = this.getBestService();
    return service !== null;
  }

  /**
   * Lấy thông tin về service hiện tại
   * @returns {Object}
   */
  getServiceStatus() {
    const googleConfigured = this.googleService?.isConfigured() || false;
    const osmConfigured = this.osmService?.isConfigured() || false;
    const { service, name } = this.getBestService();
    
    return {
      currentService: name,
      available: {
        googleMaps: googleConfigured,
        openStreetMap: osmConfigured
      },
      preferredService: this.preferredService,
      isConfigured: service !== null
    };
  }

  /**
   * So sánh các service
   * @returns {Object}
   */
  getComparison() {
    return {
      googleMaps: {
        name: 'Google Maps',
        cost: '$5/1000 requests sau 40k free',
        accuracy: 'Rất cao',
        features: ['Geocoding', 'Reverse', 'Autocomplete', 'Place Details'],
        pros: ['Độ chính xác cao', 'Autocomplete tốt', 'Nhiều tính năng'],
        cons: ['Tốn phí', 'Cần API key', 'Phức tạp setup']
      },
      openStreetMap: {
        name: 'OpenStreetMap Nominatim',
        cost: 'Miễn phí',
        accuracy: 'Tốt',
        features: ['Geocoding', 'Reverse', 'Search'],
        pros: ['Hoàn toàn miễn phí', 'Không cần API key', 'Dữ liệu mở'],
        cons: ['Rate limit 1 req/s', 'Kém chính xác hơn', 'Không có autocomplete']
      }
    };
  }

  /**
   * Test cả hai service với cùng một địa chỉ
   * @param {string} address - Địa chỉ test
   * @returns {Promise<Object>} - Kết quả so sánh
   */
  async compareServices(address) {
    const results = {
      address: address,
      googleMaps: null,
      openStreetMap: null,
      comparison: null
    };

    // Test Google Maps
    if (this.googleService?.isConfigured()) {
      try {
        const start = Date.now();
        results.googleMaps = await this.googleService.geocodeAddress(address);
        results.googleMaps.responseTime = Date.now() - start;
      } catch (error) {
        results.googleMaps = { error: error.message };
      }
    }

    // Test OpenStreetMap
    if (this.osmService?.isConfigured()) {
      try {
        const start = Date.now();
        results.openStreetMap = await this.osmService.geocodeAddress(address);
        results.openStreetMap.responseTime = Date.now() - start;
      } catch (error) {
        results.openStreetMap = { error: error.message };
      }
    }

    // So sánh kết quả
    if (results.googleMaps && results.openStreetMap && 
        !results.googleMaps.error && !results.openStreetMap.error) {
      
      const distance = this.calculateDistance(
        results.googleMaps.lat, results.googleMaps.lng,
        results.openStreetMap.lat, results.openStreetMap.lng
      );

      results.comparison = {
        coordinateDifference: `${distance.toFixed(2)} km`,
        responseTimeDiff: `Google: ${results.googleMaps.responseTime}ms, OSM: ${results.openStreetMap.responseTime}ms`,
        accuracy: distance < 0.1 ? 'Rất gần nhau' : distance < 1 ? 'Gần nhau' : 'Khác biệt đáng kể'
      };
    }

    return results;
  }

  /**
   * Tính khoảng cách giữa 2 điểm GPS
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

// Export singleton instance
const hybridGeocodingService = new HybridGeocodingService();
export default hybridGeocodingService;