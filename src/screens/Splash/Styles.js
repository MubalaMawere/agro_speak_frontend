import { StyleSheet,Dimensions } from 'react-native';
const screenWidh = Dimensions.get('window').width;
export const css = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50', // Green background like farming theme
    },

    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#4CAF50',
        opacity: 0.9,
    },

    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    logoContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },

    iconWrapper: {
        width: 120,
        height: 120,
        backgroundColor: 'white',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 15,
        position: 'relative',
    },

    appIcon: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },

    voiceIndicator: {
        position: 'absolute',
        top: -10,
        right: -10,
        flexDirection: 'row',
        alignItems: 'center',
    },

    voiceWave: {
        width: 4,
        backgroundColor: '#FF6B35',
        borderRadius: 2,
        marginHorizontal: 1,
    },

    wave1: {
        height: 8,
    },

    wave2: {
        height: 12,
    },

    wave3: {
        height: 6,
    },

    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: '500',
    },

    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    loadingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'white',
        marginHorizontal: 3,
        // Starting with low opacity - animation will control this
        opacity: 0.3,
    },

    brandingContainer: {
        position: 'absolute',
        bottom: 60,
        alignItems: 'center',
    },

    fromText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },

    companyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    companyIcon: {
        width: 24,
        height: 24,
        backgroundColor: 'white',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },

    companyIconText: {
        color: '#4CAF50',
        fontSize: 10,
        fontWeight: 'bold',
    },

    companyName: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
  
});