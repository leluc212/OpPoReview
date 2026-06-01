import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import adminEmployerService from '../../services/adminEmployerService';
import {
  Building2, Search, MapPin, Users, Briefcase,
  ChevronRight, Shield
} from 'lucide-react';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Hero ─── */
const Hero = styled.div`
  padding: 60px 48px 48px;
  text-align: center;
  background: linear-gradient(135deg, #1a62ff 0%, #002e9d 100%);
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 60% 40%, rgba(255,255,255,0.08) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 10px;
  position: relative; z-index: 1;
  letter-spacing: -1px;
`;

const HeroSub = styled(motion.p)`
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 28px;
  position: relative; z-index: 1;
`;

const SearchBar = styled(motion.div)`
  display: flex;
  align-items: center;
  max-width: 540px;
  margin: 0 auto;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  position: relative; z-index: 1;
  input {
    flex: 1;
    border: none;
    padding: 14px 16px;
    font-size: 0.95rem;
    outline: none;
    color: #1e293b;
    background: transparent;
    &::placeholder { color: #94a3b8; }
  }
  button {
    padding: 14px 20px;
    background: #1a62ff;
    border: none;
    cursor: pointer;
    color: #fff;
    display: flex;
    align-items: center;
    transition: background 0.2s;
    &:hover { background: #002e9d; }
  }
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 28px;
  position: relative; z-index: 1;
`;

const StatItem = styled.div`
  text-align: center;
  color: rgba(255,255,255,0.9);
  .num { display: block; font-size: 1.6rem; font-weight: 800; }
  .lbl { display: block; font-size: 0.78rem; opacity: 0.75; margin-top: 2px; }
`;

/* ─── Content ─── */
const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${p => p.$isDark ? '#e2e8f0' : '#1e293b'};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, #1a62ff33, transparent);
    border-radius: 2px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 20px;
`;

const Card = styled(Link)`
  background: ${p => p.$isDark ? 'rgba(30,41,59,0.8)' : '#fff'};
  border: 1.5px solid ${p => p.$isDark ? 'rgba(75,85,99,0.4)' : 'rgba(226,232,240,0.9)'};
  border-radius: 16px;
  padding: 22px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: ${fadeUp} 0.4s ease both;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  &:hover {
    border-color: #1a62ff;
    box-shadow: 0 8px 32px rgba(26,98,255,0.12);
    transform: translateY(-2px);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const LogoBox = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e0eaff, #c7d9ff);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
`;

const CompanyName = styled.div`
  font-size: 0.93rem;
  font-weight: 700;
  color: ${p => p.$isDark ? '#e2e8f0' : '#1e293b'};
  line-height: 1.3;
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: #d1fae5;
  color: #065f46;
  border-radius: 8px;
  padding: 2px 7px;
  font-size: 11px;
  font-weight: 600;
  margin-top: 3px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.81rem;
  color: ${p => p.$isDark ? '#94a3b8' : '#64748b'};
  svg { flex-shrink: 0; }
`;

const ViewBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid ${p => p.$isDark ? 'rgba(75,85,99,0.3)' : '#f1f5f9'};
  font-size: 0.82rem;
  font-weight: 600;
  color: #1a62ff;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: ${p => p.$isDark ? '#64748b' : '#94a3b8'};
  svg { margin-bottom: 16px; opacity: 0.4; }
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 20px;
`;

const SkeletonCard = styled.div`
  border-radius: 16px;
  height: 180px;
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  background: linear-gradient(90deg,
    ${p => p.$isDark ? '#1e293b' : '#f1f5f9'} 25%,
    ${p => p.$isDark ? '#334155' : '#e2e8f0'} 50%,
    ${p => p.$isDark ? '#1e293b' : '#f1f5f9'} 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite;
`;

const PageWrapper = styled.div`
  min-height: calc(100vh - 56px);
`;

/* ─── Component ─── */
const EmployerDirectory = () => {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminEmployerService.getAllEmployers()
      .then(data => setEmployers(Array.isArray(data) ? data : []))
      .catch(() => setEmployers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employers.filter(e =>
      !q ||
      (e.companyName || '').toLowerCase().includes(q) ||
      (e.industry || '').toLowerCase().includes(q) ||
      (e.address || '').toLowerCase().includes(q)
    );
  }, [employers, search]);

  const verified = employers.filter(e => e.isVerified).length;

  return (
    <PageWrapper>
      {/* Hero */}
      <Hero>
        <HeroTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {language === 'vi' ? 'Danh Sách Nhà Tuyển Dụng' : 'Employer Directory'}
        </HeroTitle>
        <HeroSub
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {language === 'vi'
            ? 'Khám phá các công ty đang tuyển dụng trên OpPo'
            : 'Discover companies hiring on OpPo'}
        </HeroSub>

        <SearchBar
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input
            placeholder={language === 'vi' ? 'Tìm theo tên công ty, ngành nghề...' : 'Search by company name, industry...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button><Search size={18} /></button>
        </SearchBar>

        {!loading && (
          <StatsRow>
            <StatItem>
              <span className="num">{employers.length}</span>
              <span className="lbl">{language === 'vi' ? 'Nhà tuyển dụng' : 'Employers'}</span>
            </StatItem>
            <StatItem>
              <span className="num">{verified}</span>
              <span className="lbl">{language === 'vi' ? 'Đã xác thực' : 'Verified'}</span>
            </StatItem>
          </StatsRow>
        )}
      </Hero>

      {/* Content */}
      <Content>
        <SectionTitle $isDark={isDarkMode}>
          <Building2 size={20} color="#1a62ff" />
          {language === 'vi'
            ? `Tất cả nhà tuyển dụng (${filtered.length})`
            : `All employers (${filtered.length})`}
        </SectionTitle>

        {loading ? (
          <LoadingGrid>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} $isDark={isDarkMode} />
            ))}
          </LoadingGrid>
        ) : filtered.length === 0 ? (
          <EmptyState $isDark={isDarkMode}>
            <Building2 size={48} />
            <p>{language === 'vi' ? 'Không tìm thấy nhà tuyển dụng nào' : 'No employers found'}</p>
          </EmptyState>
        ) : (
          <Grid>
            {filtered.map((e, i) => (
              <Card
                key={e.userId || i}
                to={`/companies/${e.userId}`}
                $isDark={isDarkMode}
                style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
              >
                <CardTop>
                  <LogoBox>
                    {e.companyLogo
                      ? <img src={e.companyLogo} alt={e.companyName} />
                      : <Building2 size={24} color="#1a62ff" />
                    }
                  </LogoBox>
                  <div>
                    <CompanyName $isDark={isDarkMode}>
                      {e.companyName || 'Unknown Company'}
                    </CompanyName>
                    {e.isVerified && (
                      <VerifiedBadge>
                        <Shield size={10} />
                        {language === 'vi' ? 'Đã xác thực' : 'Verified'}
                      </VerifiedBadge>
                    )}
                  </div>
                </CardTop>

                {e.industry && <MetaRow $isDark={isDarkMode}><Briefcase size={13} />{e.industry}</MetaRow>}
                {e.address && <MetaRow $isDark={isDarkMode}><MapPin size={13} />{e.address}</MetaRow>}
                {e.companySize && (
                  <MetaRow $isDark={isDarkMode}>
                    <Users size={13} />
                    {e.companySize} {language === 'vi' ? 'nhân viên' : 'employees'}
                  </MetaRow>
                )}

                <ViewBtn $isDark={isDarkMode}>
                  <span>{language === 'vi' ? 'Xem hồ sơ' : 'View profile'}</span>
                  <ChevronRight size={16} />
                </ViewBtn>
              </Card>
            ))}
          </Grid>
        )}
      </Content>
    </PageWrapper>
  );
};

export default EmployerDirectory;
