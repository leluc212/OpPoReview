import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { updateMyRole } from '../../services/userRoleService';

const Wrap = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #eef4ff, #f8fbff);
  padding: 24px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(2, 32, 71, 0.12);
`;

const Title = styled.h1`
  margin: 0 0 10px;
  font-size: 26px;
  color: #0f172a;
`;

const Sub = styled.p`
  margin: 0 0 18px;
  color: #475569;
  line-height: 1.5;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const RoleBtn = styled.button`
  border: 2px solid ${p => (p.$active ? '#2563eb' : '#e2e8f0')};
  background: ${p => (p.$active ? '#eff6ff' : '#fff')};
  color: #0f172a;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
`;

const Confirm = styled.button`
  margin-top: 18px;
  width: 100%;
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  opacity: ${p => (p.disabled ? 0.6 : 1)};
`;

const Error = styled.p`
  margin-top: 12px;
  color: #dc2626;
  font-size: 14px;
`;

export default function GoogleRoleSetupPage() {
  const { isAuthenticated, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('candidate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shouldShow = useMemo(() => {
    return isAuthenticated && !user?.role;
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!shouldShow) {
    const path = user?.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard';
    return <Navigate to={path} replace />;
  }

  const onConfirm = async () => {
    try {
      setLoading(true);
      setError('');
      await updateMyRole(selected);
      updateUser({ ...user, role: selected });
      navigate(selected === 'employer' ? '/employer/dashboard' : '/candidate/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not complete role setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrap>
      <Card>
        <Title>Hoan tat tai khoan Google</Title>
        <Sub>
          Chon vai tro ban muon su dung. Lua chon nay se duoc luu cho cac lan dang nhap sau.
        </Sub>
        <Grid>
          <RoleBtn type="button" $active={selected === 'candidate'} onClick={() => setSelected('candidate')}>
            Ung vien
          </RoleBtn>
          <RoleBtn type="button" $active={selected === 'employer'} onClick={() => setSelected('employer')}>
            Nha tuyen dung
          </RoleBtn>
        </Grid>
        <Confirm type="button" onClick={onConfirm} disabled={loading}>
          {loading ? 'Dang luu...' : 'Xac nhan'}
        </Confirm>
        {error && <Error>{error}</Error>}
      </Card>
    </Wrap>
  );
}
