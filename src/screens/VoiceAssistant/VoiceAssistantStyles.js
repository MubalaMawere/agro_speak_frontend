import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a3e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  conversationContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  conversationContent: {
    paddingVertical: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },

  // Language Selector
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageLabel: {
    color: '#fff',
    fontSize: 14,
    marginRight: 10,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 4,
  },
  languageButtonActive: {
    backgroundColor: '#6b8cff',
  },
  languageText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  languageTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Message Bubbles
  messageContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  userMessageBubble: {
    backgroundColor: '#6b8cff',
    borderBottomRightRadius: 4,
  },
  assistantMessageBubble: {
    backgroundColor: '#2a2a5a',
    borderBottomLeftRadius: 4,
  },
  errorMessageBubble: {
    backgroundColor: '#ff6b6b',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  assistantMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  speakButton: {
    padding: 8,
  },

  // Typing Indicator
  typingIndicator: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  typingBubble: {
    backgroundColor: '#2a2a5a',
    padding: 16,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 1,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyStateText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },

  // Greeting Card
  greetingCard: {
    backgroundColor: '#2a2a5a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6b8cff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  greetingText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },

  // Suggestions
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  suggestionButton: {
    backgroundColor: 'rgba(107, 140, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(107, 140, 255, 0.3)',
  },
  suggestionText: {
    color: '#6b8cff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Query Card
  queryCard: {
    backgroundColor: '#2a2a5a',
    borderRadius: 20,
    padding: 20,
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pauseIcon: {
    flexDirection: 'row',
    marginRight: 15,
  },
  pauseBar: {
    width: 3,
    height: 20,
    backgroundColor: '#6b8cff',
    marginHorizontal: 2,
  },
  queryText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },

  // Processing
  processingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  processingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 10,
  },

  // Waveform
  waveformContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginVertical: 30,
  },
  waveformBar: {
    width: 3,
    height: 20,
    backgroundColor: '#6b8cff',
    marginHorizontal: 2,
    borderRadius: 2,
  },

  // Bottom Container
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a3e',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  micButtonContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6b8cff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6b8cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  activeListening: {
    backgroundColor: '#ff6b6b',
  },
  micDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  bottomIcon: {
    padding: 10,
  },

  // Follow up container
  followUpContainer: {
    marginTop: 30,
  },
});