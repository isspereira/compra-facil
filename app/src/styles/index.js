import { StyleSheet } from 'react-native';

const GREEN = '#2E8B57';
const LIGHT_GREEN = '#E8F5EC';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },

  header: {
    backgroundColor: GREEN,
    padding: 24,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  logo: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#E5F5EA',
    fontSize: 14,
    marginTop: 5,
  },

  totalCard: {
    backgroundColor: LIGHT_GREEN,
    margin: 18,
    padding: 20,
    borderRadius: 15,
  },

  summaryCard: {
    backgroundColor: LIGHT_GREEN,
    margin: 18,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },

  totalLabel: {
    color: '#456454',
    fontSize: 14,
  },

  totalValue: {
    color: GREEN,
    fontSize: 29,
    fontWeight: 'bold',
    marginTop: 8,
  },

  sectionHeader: {
    marginHorizontal: 18,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#244333',
    marginBottom: 18,
  },

  smallText: {
    color: '#777777',
    fontSize: 12,
  },

  productCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginVertical: 5,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },

  productInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  productImage: {
    width: 55,
    height: 55,
    borderRadius: 8,
    marginBottom: 7,
  },

  productName: {
    color: '#244333',
    fontWeight: 'bold',
    fontSize: 15,
  },

  purchasedText: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },

  actions: {
    flexDirection: 'row',
    gap: 14,
    marginLeft: 8,
  },

  emptyText: {
    textAlign: 'center',
    color: '#888888',
    margin: 30,
    lineHeight: 22,
  },

  addButton: {
    backgroundColor: GREEN,
    margin: 18,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  form: {
    padding: 20,
  },

  label: {
    color: '#244333',
    fontWeight: '600',
    marginBottom: 7,
    marginTop: 15,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5E5DA',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },

  imageButton: {
    backgroundColor: LIGHT_GREEN,
    borderWidth: 1,
    borderColor: '#C5DFCE',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 3,
  },

  imageButtonText: {
    color: GREEN,
    fontSize: 15,
    fontWeight: 'bold',
  },

  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: 15,
  },

  imagePreview: {
    width: 180,
    height: 180,
    borderRadius: 12,
  },

  removeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
  },

  removeImageText: {
    color: '#D9534F',
    fontWeight: '600',
  },

  cancelButton: {
    alignItems: 'center',
    padding: 14,
  },

  cancelText: {
    color: GREEN,
    fontWeight: 'bold',
  },

  statCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginVertical: 7,
    padding: 18,
    borderRadius: 13,
    alignItems: 'center',
  },

  statNumber: {
    color: GREEN,
    fontSize: 27,
    fontWeight: 'bold',
  },

  statLabel: {
    color: '#456454',
    marginTop: 5,
  },
});

export default styles;
