import candidateProfileService from './candidateProfileService';
import adminEmployerService from './adminEmployerService';
import jobPostService from './jobPostService';
import quickJobService from './quickJobService';

const SUBSCRIPTIONS_API_URL = import.meta.env.VITE_PACKAGE_SUBSCRIPTIONS_API || 'https://u28w4m6yb7.execute-api.ap-southeast-1.amazonaws.com/prod';

class AdminReportService {
  /**
   * Fetch all data needed for the reports page
   */
  async getReportsData() {
    try {
      console.log('📊 AdminReportService: Fetching consolidated reports data...');
      
      const fetchData = async (serviceMethod, fallback = []) => {
        try {
          return await serviceMethod();
        } catch (error) {
          console.error(`⚠️ AdminReportService: Sub-request failed:`, error);
          return fallback;
        }
      };

      const [candidates, employers, standardJobs, quickJobs, subscriptions] = await Promise.all([
        fetchData(() => candidateProfileService.getAllCandidates()),
        fetchData(() => adminEmployerService.getAllEmployers()),
        fetchData(() => jobPostService.getAllJobPosts()),
        fetchData(() => quickJobService.getAllQuickJobs()),
        fetchData(() => this.getAllSubscriptions())
      ]);

      console.log('✅ AdminReportService: Consolidated reports data fetched (with partial fallbacks if needed)');
      
      return {
        candidates,
        employers,
        standardJobs,
        quickJobs,
        subscriptions
      };
    } catch (error) {
      console.error('❌ AdminReportService: Error fetching reports data:', error);
      throw error;
    }
  }

  /**
   * Fetch all subscriptions
   */
  async getAllSubscriptions() {
    try {
      const response = await fetch(`${SUBSCRIPTIONS_API_URL}/subscriptions`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ AdminReportService: Error fetching subscriptions:', error);
      return [];
    }
  }

  /**
   * Process and calculate statistics from raw data with trends
   */
  calculateStats(data) {
    const { candidates, employers, standardJobs, quickJobs, subscriptions } = data;

    // Time periods for trends (Current vs Previous Month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const isCurrentPeriod = (dateStr) => {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    };

    const isPreviousPeriod = (dateStr) => {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d.getMonth() === prevMonth && d.getFullYear() === prevMonthYear;
    };

    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const growth = ((current - previous) / previous) * 100;
      return (growth >= 0 ? '+' : '') + growth.toFixed(1) + '%';
    };

    // Calculate counts for trend comparison
    const currCandidates = candidates.filter(c => isCurrentPeriod(c.createdAt)).length;
    const prevCandidates = candidates.filter(c => isPreviousPeriod(c.createdAt)).length;
    
    const currEmployers = employers.filter(e => isCurrentPeriod(e.createdAt)).length;
    const prevEmployers = employers.filter(e => isPreviousPeriod(e.createdAt)).length;
    
    const currStandardJobs = standardJobs.filter(j => isCurrentPeriod(j.createdAt)).length;
    const prevStandardJobs = standardJobs.filter(j => isPreviousPeriod(j.createdAt)).length;
    
    const currQuickJobs = quickJobs.filter(j => isCurrentPeriod(j.createdAt)).length;
    const prevQuickJobs = quickJobs.filter(j => isPreviousPeriod(j.createdAt)).length;

    // Revenue calculation with trend
    const getRevenueForPeriod = (list, filterFn) => {
      return list
        .filter(s => (s.status === 'active' || s.status === 'expired' || s.status === 'expiring') && filterFn(s.purchaseDateTime || s.createdAt))
        .reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    };

    const currRevenue = getRevenueForPeriod(subscriptions, isCurrentPeriod);
    const prevRevenue = getRevenueForPeriod(subscriptions, isPreviousPeriod);

    // Basic counts
    const totalCandidates = candidates.length;
    const totalEmployers = employers.length;
    const totalStandardJobs = standardJobs.length;
    const totalQuickJobs = quickJobs.length;

    // Subscription stats
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
    const pendingSubscriptions = subscriptions.filter(s => s.status === 'pending' || s.approvalStatus === 'pending').length;
    
    const totalRevenue = subscriptions
      .filter(s => s.status === 'active' || s.status === 'expired' || s.status === 'expiring')
      .reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);

    return {
      totalCandidates,
      totalEmployers,
      totalStandardJobs,
      totalQuickJobs,
      activeSubscriptions,
      pendingSubscriptions,
      totalRevenue,
      trends: {
        candidates: calculateGrowth(currCandidates, prevCandidates),
        employers: calculateGrowth(currEmployers, prevEmployers),
        standardJobs: calculateGrowth(currStandardJobs, prevStandardJobs),
        quickJobs: calculateGrowth(currQuickJobs, prevQuickJobs),
        revenue: calculateGrowth(currRevenue, prevRevenue)
      }
    };
  }

  /**
   * Extract unique districts from available data
   */
  getDynamicDistricts(data) {
    const { candidates, standardJobs, quickJobs } = data;
    const locations = new Set();
    
    const extract = (list, field) => {
      if (!Array.isArray(list)) return;
      list.forEach(item => {
        if (item[field] && typeof item[field] === 'string') {
          // Normalize: "Quận 1, TP.HCM" -> "Quận 1"
          const district = item[field].split(',')[0].trim();
          if (district && district.length < 30) locations.add(district);
        }
      });
    };

    extract(candidates, 'location');
    extract(standardJobs, 'location');
    extract(quickJobs, 'location');

    const result = Array.from(locations).sort();
    return result.length > 0 ? ['Tất cả quận', ...result] : ['Tất cả quận', 'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận Thủ Đức', 'Quận Bình Thạnh'];
  }

  /**
   * Calculate detailed stats per service package dynamically from data
   */
  calculatePackageStats(subscriptions) {
    if (!Array.isArray(subscriptions)) return [];

    // Map to store stats per unique package name
    const statsMap = {};

    subscriptions.forEach(s => {
      const pkgName = s.packageName || 'Unknown Package';
      if (!statsMap[pkgName]) {
        statsMap[pkgName] = {
          name: pkgName,
          type: (pkgName.toLowerCase().includes('gấp') || pkgName.toLowerCase().includes('urgent')) ? 'urgent' : 'standard',
          activeCount: 0,
          totalCount: 0,
          revenue: 0,
          price: s.price || 0,
          duration: s.duration || '7 ngày'
        };
      }

      statsMap[pkgName].totalCount += 1;
      if (s.status === 'active') {
        statsMap[pkgName].activeCount += 1;
      }
      
      // Revenue from successful, expired or pending subscriptions (all except rejected)
      if (s.status === 'active' || s.status === 'expired' || s.status === 'expiring' || s.status === 'pending') {
        statsMap[pkgName].revenue += (parseFloat(s.price) || 0);
      }
    });

    return Object.values(statsMap).map(pkg => ({
      ...pkg,
      revenue: new Intl.NumberFormat('vi-VN').format(pkg.revenue) + ' VND',
      rawRevenue: pkg.revenue,
      price: pkg.price ? `${new Intl.NumberFormat('vi-VN').format(pkg.price)} VND` : 'Sắp có'
    })).sort((a, b) => b.rawRevenue - a.rawRevenue);
  }

  /**
   * Group subscriptions by month for revenue chart
   */
  getRevenueByMonth(subscriptions) {
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const currentYear = new Date().getFullYear();
    
    const revenueByMonth = months.map(m => ({ month: m, revenue: 0 }));

    subscriptions.forEach(s => {
      // Check for valid status for revenue
      if (s.status === 'pending' || s.approvalStatus === 'rejected') return;

      const dateStr = s.purchaseDateTime || s.createdAt;
      const date = dateStr ? new Date(dateStr) : null;
      
      if (date && date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        // Convert to Millions (M) for display
        revenueByMonth[monthIndex].revenue += (parseFloat(s.price) || 0) / 1000000;
      }
    });

    return revenueByMonth;
  }

  /**
   * Get top employers by total revenue spend
   */
  getTopEmployersByRevenue(subscriptions) {
    const revenueMap = {};
    const pkgCountMap = {};

    subscriptions.forEach(s => {
      if (s.status === 'pending') return;
      
      const company = s.companyName || 'Unknown Company';
      revenueMap[company] = (revenueMap[company] || 0) + (parseFloat(s.price) || 0);
      pkgCountMap[company] = (pkgCountMap[company] || 0) + 1;
    });

    return Object.entries(revenueMap)
      .map(([name, revenue]) => ({
        name,
        revenue: (revenue / 1000000).toFixed(1) + 'M',
        rawRevenue: revenue,
        packages: pkgCountMap[name]
      }))
      .sort((a, b) => b.rawRevenue - a.rawRevenue)
      .slice(0, 5);
  }
}

export default new AdminReportService();
