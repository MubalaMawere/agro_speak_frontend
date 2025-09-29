import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive helper
const isSmallScreen = height < 700;
const isMediumScreen = height >= 700 && height < 900;
const isLargeScreen = height >= 900;

const getResponsiveValue = (small, medium, large) => {
    if (isSmallScreen) return small;
    if (isMediumScreen) return medium;
    return large;
};

export const css = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    // Header Section
    headerSection: {
        minHeight: getResponsiveValue(120, 150, 180),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: getResponsiveValue(20, 30, 40),
    },

    logoContainer: {
        alignItems: 'center',
    },

    logoIcon: {
        width: getResponsiveValue(60, 70, 80),
        height: getResponsiveValue(60, 70, 80),
        backgroundColor: 'white',
        borderRadius: getResponsiveValue(15, 17, 20),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: getResponsiveValue(8, 10, 12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },

    logoText: {
        fontSize: getResponsiveValue(22, 26, 28),
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: getResponsiveValue(3, 4, 5),
        letterSpacing: 1,
    },

    welcomeText: {
        fontSize: getResponsiveValue(14, 15, 16),
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },

    // Form Section
    formSection: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: getResponsiveValue(10, 15, 20),
    },

    authMethodContainer: {
        flexDirection: 'row',
        backgroundColor: '#e8f5e8',
        borderRadius: 20,
        padding: 3,
        marginBottom: getResponsiveValue(20, 25, 30),
    },

    methodButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: getResponsiveValue(12, 14, 16),
        paddingHorizontal: 15,
        borderRadius: 17,
        backgroundColor: 'transparent',
    },

    activeMethod: {
        backgroundColor: '#4CAF50',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },

    methodText: {
        marginLeft: 6,
        fontSize: getResponsiveValue(14, 15, 16),
        fontWeight: '600',
        color: '#4CAF50',
    },

    activeMethodText: {
        color: 'white',
    },

    formContainer: {
        backgroundColor: 'white',
        borderRadius: getResponsiveValue(15, 17, 20),
        padding: getResponsiveValue(20, 25, 30),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        flex: 1,
    },

    inputContainer: {
        marginBottom: getResponsiveValue(18, 20, 22),
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: getResponsiveValue(12, 13, 15),
        paddingHorizontal: 10,
        paddingVertical: getResponsiveValue(0, 0, 0),
        borderWidth: 3,
        borderColor: '#e0e0e0',
        minHeight: getResponsiveValue(0, 40, 0),
        maxHeight: getResponsiveValue(50, 50, 70),
    },

    inputIcon: {
        marginRight: 12,
        width: 20,
    },

    textInput: {
        flex: 1,
        fontSize: getResponsiveValue(15, 16, 17),
        color: '#333',
        paddingVertical: getResponsiveValue(12, 14, 16),
        fontWeight: '500',
        includeFontPadding: false,
    },

    eyeIcon: {
        padding: 8,
        marginLeft: 5,
    },

    // Action Links (for login)
    actionLinksContainer: {
        alignItems: 'flex-end',
        marginBottom: getResponsiveValue(20, 25, 30),
        marginTop: getResponsiveValue(0, 0, 5),
    },

    actionLink: {
        color: '#4CAF50',
        fontSize: getResponsiveValue(13, 14, 15),
        fontWeight: '600',
    },

    submitButton: {
        backgroundColor: '#4CAF50',
        borderRadius: getResponsiveValue(12, 13, 15),
        paddingVertical: getResponsiveValue(14, 16, 18),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginTop: 20,
        minHeight: getResponsiveValue(50, 55, 60),
    },

    submitButtonDisabled: {
        backgroundColor: '#cccccc',
        shadowOpacity: 0,
        elevation: 0,
    },

    submitButtonText: {
        color: 'white',
        fontSize: getResponsiveValue(16, 17, 18),
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },

    bottomSection: {
        paddingHorizontal: 20,
        paddingBottom: getResponsiveValue(25, 30, 35),
        justifyContent: 'center',
    },

    bottomFixedContainer: {
        paddingHorizontal: 20,
        paddingBottom: getResponsiveValue(25, 30, 35),
        paddingTop: getResponsiveValue(10, 15, 20),
    },

    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: getResponsiveValue(10, 12, 15),
    },

    toggleText: {
        color: '#666',
        fontSize: getResponsiveValue(14, 15, 16),
        fontWeight: '500',
    },

    toggleLink: {
        color: '#4CAF50',
        fontSize: getResponsiveValue(14, 15, 16),
        fontWeight: 'bold',
    },

    registerInputsContainer: {
        flex: 1,
    },

    termsContainer: {
        marginBottom: getResponsiveValue(20, 25, 30),
        paddingHorizontal: 5,
        marginTop: getResponsiveValue(5, 10, 15),
    },

    termsText: {
        fontSize: getResponsiveValue(11, 12, 13),
        color: '#666',
        textAlign: 'center',
        lineHeight: getResponsiveValue(16, 18, 20),
    },

    termsLink: {
        color: '#4CAF50',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },

    // Loading overlay
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: getResponsiveValue(15, 17, 20),
    },

    loadingText: {
        marginTop: 10,
        fontSize: getResponsiveValue(14, 15, 16),
        color: '#4CAF50',
        fontWeight: '600',
    },

    inputError: {
        borderColor: '#ff4444',
        borderWidth: 2,
    },

    inputSuccess: {
        borderColor: '#4CAF50',
        borderWidth: 2,
    },

    errorText: {
        color: '#ff4444',
        fontSize: getResponsiveValue(11, 12, 12),
        marginTop: 5,
        marginLeft: 15,
    },

    successText: {
        color: '#4CAF50',
        fontSize: getResponsiveValue(11, 12, 12),
        marginTop: 5,
        marginLeft: 15,
    },
});
