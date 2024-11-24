const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  stepContainer: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepImage: {
    height: 150,
    width: 150,
    marginBottom: 8,
  },
  stepTitle: {
    textAlign: 'center',
    fontFamily: 'Roboto-Bold', // Use your desired font here
    fontSize: 18, // Adjust font size as needed
  },
  stepDescription: {
    textAlign: 'center',
    maxWidth: '80%',
    paddingHorizontal: 8,
    fontFamily: 'Roboto-Regular', // Use your desired font here
    fontSize: 14, // Adjust font size as needed
  },
  reactLogo: {
    height: 178,
    width: 300,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#01F0D0',
  },
});
