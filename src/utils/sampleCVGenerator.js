import jsPDF from 'jspdf';

// Helper function to remove Vietnamese accents
const removeVietnameseAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

// Function to initialize sample CV for testing
export const initializeSampleCV = async () => {
  // Check if CV already exists
  const existingCV = localStorage.getItem('candidateCV');

  if (!existingCV) {
    const cvData = await createSamplePDFData('Đỗ Hoàng Hiếu', 'Store Manager');
    if (cvData) {
      localStorage.setItem('candidateCV', JSON.stringify(cvData));
      console.log('Sample CV initialized successfully');
    }
  }
};

// Create a real PDF file using jsPDF
export const createSamplePDFData = async (candidateName, jobTitle) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Helper function to add section
  const addSection = (title, yPosition) => {
    doc.setFillColor(30, 64, 175);
    doc.rect(margin - 2, yPosition - 5, 3, 6, 'F');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text(removeVietnameseAccents(title), margin + 3, yPosition);
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
    return yPosition + 8;
  };

  // Header background with gradient effect
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 55, 'F');

  // Add subtle gradient effect
  for (let i = 0; i < 55; i++) {
    const alpha = i / 55;
    const blue = Math.floor(175 + (246 - 175) * alpha);
    doc.setFillColor(30 + alpha * 20, 64 + alpha * 20, blue);
    doc.rect(0, i, pageWidth, 1, 'F');
  }

  // Name with shadow effect
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(removeVietnameseAccents(candidateName.toUpperCase()), pageWidth / 2, 20, { align: 'center' });

  // Job Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(removeVietnameseAccents(jobTitle), pageWidth / 2, 30, { align: 'center' });

  // Contact Info with better spacing
  doc.setFontSize(9);
  const email = `${removeVietnameseAccents(candidateName).toLowerCase().replace(/\s+/g, '')}@example.com`;
  const contactInfo = [
    `Email: ${email}`,
    `Phone: 0123 456 789`,
    `Location: TP. Ho Chi Minh`
  ];

  let contactX = pageWidth / 2 - 60;
  contactInfo.forEach((info, i) => {
    doc.setFillColor(255, 255, 255, 0.2);
    doc.roundedRect(contactX, 37, 40, 5, 1, 1, 'F');
    doc.text(removeVietnameseAccents(info), contactX + 20, 40.5, { align: 'center' });
    contactX += 42;
  });

  let yPos = 65;

  // Career Objective Section
  yPos = addSection('MUC TIEU NGHE NGHIEP', yPos);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const objective = removeVietnameseAccents(`Chuyen gia ${jobTitle} voi ${Math.floor(Math.random() * 3) + 3} nam kinh nghiem quan ly va van hanh. Dam me mang den trai nghiem khach hang xuat sac, phat trien doi ngu chuyen nghiep va tang truong doanh thu ben vung cho doanh nghiep.`);
  const objectiveLines = doc.splitTextToSize(objective, contentWidth - 5);
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, yPos, contentWidth, objectiveLines.length * 5 + 4, 2, 2, 'F');
  doc.text(objectiveLines, margin + 3, yPos + 4);
  yPos += objectiveLines.length * 5 + 10;

  // Work Experience Section
  yPos = addSection('KINH NGHIEM LAM VIEC', yPos);

  const experiences = [
    {
      position: removeVietnameseAccents(`${jobTitle} Senior`),
      company: 'Katinat Coffee',
      period: '01/2022 - Hien tai',
      achievements: [
        'Quan ly doi ngu 15+ nhan vien, tang doanh thu 35% trong nam 2023',
        'Dao tao va phat trien ky nang cho hon 20 nhan vien moi',
        'Duy tri chat luong dich vu va su hai long khach hang 4.8/5 sao',
        'Quan ly ngan sach, kiem soat chi phi va toi uu hoa loi nhuan tren 20%'
      ]
    },
    {
      position: removeVietnameseAccents(jobTitle),
      company: 'The Coffee House',
      period: '03/2020 - 12/2021',
      achievements: [
        'Ho tro quan ly dieu hanh cua hang voi doanh thu 2 ty/thang',
        'Dao tao 30+ nhan vien moi ve ky nang chuyen mon va dich vu',
        'Xu ly khieu nai khach hang va duy tri chat luong dich vu cao',
        'Tham gia xay dung quy trinh van hanh tieu chuan cho he thong'
      ]
    },
    {
      position: removeVietnameseAccents(`Nhan vien ${jobTitle}`),
      company: 'Highlands Coffee',
      period: '06/2019 - 02/2020',
      achievements: [
        'Dieu phoi doi ngu 8 nhan vien trong ca lam viec',
        'Dam bao quy trinh van hanh, ve sinh va chat luong san pham',
        'Bao cao doanh thu va ton kho hang ngay',
        'Duoc binh chon la nhan vien xuat sac quy 4/2019'
      ]
    }
  ];

  experiences.forEach((exp, index) => {
    // Experience header box
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, yPos, contentWidth, 12, 1, 1, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text(removeVietnameseAccents(exp.position), margin + 3, yPos + 5);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(removeVietnameseAccents(exp.period), pageWidth - margin - 3, yPos + 5, { align: 'right' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(71, 85, 105);
    doc.text(removeVietnameseAccents(exp.company), margin + 3, yPos + 10);

    yPos += 15;

    // Achievements
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    exp.achievements.forEach((achievement) => {
      doc.circle(margin + 2, yPos - 1, 0.8, 'F');
      const lines = doc.splitTextToSize(removeVietnameseAccents(achievement), contentWidth - 10);
      doc.text(lines, margin + 5, yPos);
      yPos += lines.length * 4;
    });

    yPos += 3;
  });

  // Check if we need a new page
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  // Education Section
  yPos = addSection('HOC VAN', yPos);

  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, yPos, contentWidth, 20, 1, 1, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(removeVietnameseAccents('Cu nhan Quan tri Kinh doanh'), margin + 3, yPos + 5);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('2015 - 2019', pageWidth - margin - 3, yPos + 5, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(71, 85, 105);
  doc.text(removeVietnameseAccents('Dai hoc Kinh Te TP.HCM'), margin + 3, yPos + 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(removeVietnameseAccents('Chuyen nganh: Quan tri Dich vu & Du lich'), margin + 3, yPos + 14);
  doc.text(removeVietnameseAccents('GPA: 3.6/4.0 | Tot nghiep Loai Gioi'), margin + 3, yPos + 18);

  yPos += 25;

  // Skills Section
  yPos = addSection('KY NANG', yPos);

  const skillCategories = [
    { category: 'Quan ly', skills: ['Quan ly van hanh', 'Dao tao nhan su', 'Lanh dao doi nhom'] },
    { category: 'Chuyen mon', skills: ['Cham soc khach hang', 'Phan tich doanh thu', 'Quan ly ton kho'] },
    { category: 'Tin hoc', skills: ['MS Office', 'POS Systems', 'Giai quyet van de'] }
  ];

  skillCategories.forEach((category) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(removeVietnameseAccents(`${category.category}:`), margin, yPos);

    let xPos = margin + 25;
    category.skills.forEach((skill) => {
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      const skillText = removeVietnameseAccents(skill);
      const skillWidth = doc.getTextWidth(skillText) + 6;
      doc.roundedRect(xPos, yPos - 3, skillWidth, 5, 1, 1, 'FD');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 64, 175);
      doc.text(skillText, xPos + 3, yPos);
      xPos += skillWidth + 3;
    });

    yPos += 8;
  });

  yPos += 3;

  // Certificates Section
  yPos = addSection('CHUNG CHI', yPos);

  const certificates = [
    { name: 'Professional Certificate', org: 'Specialty Association', year: '2021' },
    { name: 'Food Safety & Hygiene Level 1', org: 'Bo Y te', year: '2020' },
    { name: 'Leadership & Management', org: 'Dale Carnegie', year: '2022' }
  ];

  certificates.forEach((cert) => {
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, yPos, contentWidth, 8, 1, 1, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text(removeVietnameseAccents(cert.name), margin + 3, yPos + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(removeVietnameseAccents(`${cert.org} (${cert.year})`), margin + 3, yPos + 7);

    yPos += 10;
  });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(removeVietnameseAccents('CV duoc tao tu dong cho muc dich demo - OpPoReview Platform'), pageWidth / 2, 285, { align: 'center' });

  // Convert PDF to blob and then to base64
  const pdfBlob = doc.output('blob');

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        name: `CV_${candidateName.replace(/\s+/g, '_')}.pdf`,
        size: pdfBlob.size,
        uploadDate: new Date().toISOString(),
        data: reader.result
      });
    };
    reader.readAsDataURL(pdfBlob);
  });
};

// Initialize sample CVs for multiple candidates
export const initializeMultipleSampleCVs = async () => {
  const candidates = [
    { id: 1, name: 'Đỗ Hoàng Hiếu', job: 'Nhân viên Cửa hàng trưởng' },
    { id: 2, name: 'Phạm Lê Duy', job: 'Nhân viên Thu ngân' },
    { id: 3, name: 'Trần Phương Tuấn', job: 'Nhân viên Barista' }
  ];

  for (const candidate of candidates) {
    const cvKey = `candidateCV_${candidate.id}`;
    const existingCV = localStorage.getItem(cvKey);

    if (!existingCV) {
      const cvData = await createSamplePDFData(candidate.name, candidate.job);
      localStorage.setItem(cvKey, JSON.stringify(cvData));
    }
  }

  // Also set the main candidateCV for the first candidate
  const mainCV = localStorage.getItem('candidateCV');
  if (!mainCV) {
    const cvData = await createSamplePDFData(candidates[0].name, candidates[0].job);
    localStorage.setItem('candidateCV', JSON.stringify(cvData));
  }

  console.log('Sample CVs initialized for all candidates');
};
