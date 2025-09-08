import { StyleSheet } from 'react-native';

export const SEARCH_STYLES = StyleSheet.create({
  // Quick Search Styles
  quickSearchSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickSearchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  quickSearchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickSearchButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  quickSearchText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },

  // Recent Searches Styles
  recentSearchesSection: {
    backgroundColor: 'white',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  recentSearchesScroll: {
    paddingRight: 16,
  },
  recentSearchChip: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#bbdefb',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  recentSearchText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '500',
  },
});


