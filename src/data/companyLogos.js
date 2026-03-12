// Company logo mappings
export const companyLogos = {
  'Lẩu Bò Sài Gòn Vi Vu': '/OpPoReview/images/lemoments.png',
  'Ốc Đêm 79': '/OpPoReview/images/ngogia.png',
  'Tiệm Trà Tháng Tư': '/OpPoReview/images/phache.png',
  'Bia Sệt 123': '/OpPoReview/images/bamos.png',
  'Bếp Nhà Mẹ Nấu': '/OpPoReview/images/linhvat.png',
  'Chill Out Beer Club': '/OpPoReview/images/coffeehouse.jpg',
  'Phở Gia Truyền 1954': '/OpPoReview/images/phuclong.jpg',
  'Sushi Sen Mini': '/OpPoReview/images/seoul.jpg',
  'High Tea & Coffee': '/OpPoReview/images/highlands.jpg',
  'Gà Nướng Ò Ó O': '/OpPoReview/images/starbuck.png',
  'Nướng Ngói Gia Bảo': '/OpPoReview/images/suncha.jpg',
  'Lẩu Phan': '/OpPoReview/images/trungnguyen.jpg',
  'Urban Coffee': '/OpPoReview/images/katinat.png',
  'Dimsum House': '/OpPoReview/images/katinatlogo.jpg',
  'Bánh Mì PewPew': '/OpPoReview/images/phucloctho.jpg',
  'Beer Garden Phố': '/OpPoReview/images/banner.png',
  'Pizza 4P\'s': '/OpPoReview/images/logoplt.png',
  'Katinat - Quận 8': '/OpPoReview/images/katinatlogo.jpg',
  'Katinat Quận 8': '/OpPoReview/images/katinatlogo.jpg',
  'Katinat chi nhánh quận 8': '/OpPoReview/images/katinatlogo.jpg',
  'Katinat - Quận 2': '/OpPoReview/images/katinatlogo.jpg',
  'Seoul Vua Mì Cay': '/OpPoReview/images/seoul.jpg'
};

// Get company logo with fallback
export const getCompanyLogo = (companyName) => {
  return companyLogos[companyName] || null;
};

// Get company initial as fallback
export const getCompanyInitial = (companyName) => {
  return companyName ? companyName.charAt(0).toUpperCase() : '?';
};