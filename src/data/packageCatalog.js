export const DEFAULT_PACKAGE_CATALOG = [
  {
    packageId: 'hot-search',
    packageName: 'Hot Search',
    order: 1,
    subtitle: {
      vi: 'Ưu tiên tìm kiếm',
      en: 'Priority Search'
    },
    prices: [
      { duration: '24h', amount: 19000 },
      { duration: '5 ngày', amount: 79000 },
      { duration: '7 ngày', amount: 99000 }
    ],
    features: {
      vi: [
        'Lên Top tìm kiếm theo ngành nghề/khu vực',
        'Tăng lượt click & ứng tuyển',
        'Ưu tiên hiển thị trước đối thủ'
      ],
      en: [
        'Top search by industry/area',
        'Boost clicks & applications',
        'Priority visibility over competitors'
      ]
    },
    color: '#1e40af',
    bg: '#EFF6FF',
    bd: '#BFDBFE',
    dur: '3.6s',
    featured: true,
    iconKey: 'star'
  },
  {
    packageId: 'quick-boost',
    packageName: 'Quick Boost',
    order: 2,
    subtitle: {
      vi: 'Đẩy tin bảng tin chung',
      en: 'Push to general feed'
    },
    prices: [
      { duration: '24h', amount: 29000 },
      { duration: '5 ngày', amount: 99000 },
      { duration: '7 ngày', amount: 149000 }
    ],
    features: {
      vi: [
        'Tự động đẩy tin lên đầu bảng tin',
        'Không lo bài đăng bị trôi',
        'Gắn tag nổi bật [Tuyển Gấp]'
      ],
      en: [
        'Auto-push post to top of feed',
        'No worries about post fading away',
        'Featured tag [Urgent Hiring]'
      ]
    },
    color: '#10B981',
    bg: '#ECFDF5',
    bd: '#A7F3D0',
    dur: '4.2s',
    featured: false,
    iconKey: 'zap'
  },
  {
    packageId: 'spotlight-banner',
    packageName: 'Spotlight Banner',
    order: 3,
    subtitle: {
      vi: '1 Banner Tĩnh',
      en: '1 Static Banner'
    },
    prices: [
      { duration: '24h', amount: 39000 },
      { duration: '5 ngày', amount: 129000 },
      { duration: '7 ngày', amount: 199000 }
    ],
    features: {
      vi: [
        'Hiển thị Banner riêng tại Trang chủ',
        'Tăng nhận diện thương hiệu tuyển dụng',
        'Click banner → vào thẳng job'
      ],
      en: [
        'Display custom banner on homepage',
        'Boost employer branding',
        'Click banner directly to job'
      ]
    },
    color: '#F59E0B',
    bg: '#FFFBEB',
    bd: '#FDE68A',
    dur: '5s',
    featured: false,
    iconKey: 'rocket'
  },
  {
    packageId: 'top-spotlight',
    packageName: 'Top Spotlight',
    order: 4,
    subtitle: {
      vi: '2 Banner Động + Tĩnh',
      en: '2 Dynamic + Static Banners'
    },
    prices: [
      { duration: '24h', amount: 59000 },
      { duration: '5 ngày', amount: 249000 },
      { duration: '7 ngày', amount: 349000 }
    ],
    features: {
      vi: [
        'Sở hữu Hero Banner nổi bật nhất',
        'Banner động + Banner tĩnh Premium',
        'Thu hút tối đa lượt xem & ứng tuyển'
      ],
      en: [
        'Own the most prominent Hero Banner',
        'Dynamic + static Premium banner',
        'Attract maximum views & applications'
      ]
    },
    color: '#DC2626',
    bg: '#FEE2E2',
    bd: '#FECACA',
    dur: '4.5s',
    featured: false,
    iconKey: 'sparkles'
  }
];

export const PACKAGE_ICON_KEYS = {
  'Quick Boost': 'zap',
  'Hot Search': 'star',
  'Spotlight Banner': 'rocket',
  'Top Spotlight': 'sparkles'
};

export const cloneDefaultPackageCatalog = () =>
  DEFAULT_PACKAGE_CATALOG.map((item) => ({
    ...item,
    subtitle: { ...item.subtitle },
    prices: item.prices.map((price) => ({ ...price })),
    features: {
      vi: [...item.features.vi],
      en: [...item.features.en]
    }
  }));
