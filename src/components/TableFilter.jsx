import React from 'react';
import styled from 'styled-components';
import { Search, Filter, X } from 'lucide-react';

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FilterButton = styled.button`
  padding: 10px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$active ? props.theme.colors.primary : 'white'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.$active ? props.theme.colors.primaryDark : props.theme.colors.bgDark};
  }
`;

const FilterDropdown = styled.div`
  position: relative;
`;

const FilterOptions = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: 12px;
  min-width: 200px;
  z-index: 100;
  display: ${props => props.$show ? 'block' : 'none'};
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.sm};
  
  &:hover {
    background: ${props => props.theme.colors.bgDark};
  }
  
  input {
    cursor: pointer;
  }
  
  span {
    font-size: 14px;
    color: ${props => props.theme.colors.text};
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 13px;
  font-weight: 500;
  
  button {
    padding: 0;
    background: none;
    border: none;
    color: inherit;
    display: flex;
    align-items: center;
    cursor: pointer;
    
    svg {
      width: 14px;
      height: 14px;
    }
    
    &:hover {
      opacity: 0.7;
    }
  }
`;

const TableFilter = ({ 
  searchValue, 
  onSearchChange, 
  filterOptions = [], 
  activeFilters = [], 
  onFilterToggle,
  searchPlaceholder = 'Search...'
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  
  const handleRemoveFilter = (filterValue) => {
    onFilterToggle(filterValue);
  };
  
  return (
    <FilterContainer>
      <SearchBox>
        <Search />
        <SearchInput 
          type="text" 
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </SearchBox>
      
      {filterOptions.length > 0 && (
        <FilterDropdown>
          <FilterButton 
            $active={activeFilters.length > 0}
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <Filter />
            Filter {activeFilters.length > 0 && `(${activeFilters.length})`}
          </FilterButton>
          
          <FilterOptions $show={showFilterDropdown}>
            {filterOptions.map((option) => (
              <FilterOption key={option.value}>
                <input
                  type="checkbox"
                  checked={activeFilters.includes(option.value)}
                  onChange={() => onFilterToggle(option.value)}
                />
                <span>{option.label}</span>
              </FilterOption>
            ))}
          </FilterOptions>
        </FilterDropdown>
      )}
      
      {activeFilters.length > 0 && (
        <ActiveFilters>
          {activeFilters.map((filter) => {
            const option = filterOptions.find(opt => opt.value === filter);
            return (
              <FilterChip key={filter}>
                {option?.label}
                <button onClick={() => handleRemoveFilter(filter)}>
                  <X />
                </button>
              </FilterChip>
            );
          })}
        </ActiveFilters>
      )}
    </FilterContainer>
  );
};

export default TableFilter;
