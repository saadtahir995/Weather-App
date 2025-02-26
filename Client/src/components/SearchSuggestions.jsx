import React from 'react';

const SearchSuggestions = ({ suggestions, onSelect, visible }) => {
  if (!visible || suggestions.length === 0) return null;

  return (
    <div className="search-suggestions">
      {suggestions.map((city, index) => (
        <div
          key={`${city.name}-${index}`}
          className="suggestion-item"
          onClick={() => onSelect(city.name)}
        >
          <span className="city-name">{city.name}</span>
          {city.country && <span className="country-name">, {city.country}</span>}
        </div>
      ))}
    </div>
  );
};

export default SearchSuggestions; 