import {Dimensions, StyleSheet} from 'react-native';
import {useState} from "react";

const { width, height } = Dimensions.get('window');


// Responsive helper
const isSmallScreen = height < 700;
const isMediumScreen = height >= 700 && height < 900;

export const getResponsiveValue = (small, medium, large) => {
    if (isSmallScreen) return small;
    if (isMediumScreen) return medium;
    return large;
};


export const  styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    // Header Section
    headerSection: {
        minHeight: getResponsiveValue(80, 100, 120),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: getResponsiveValue(20, 30, 40),
        flexDirection: 'row',
    },

    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    logoIcon: {
        width: getResponsiveValue(32, 36, 40),
        height: getResponsiveValue(32, 36, 40),
        backgroundColor: '#4CAF50',
        borderRadius: getResponsiveValue(8, 9, 10),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },

    logoText: {
        fontSize: getResponsiveValue(18, 20, 22),
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 0.5,
    },

    skipButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'transparent',
    },

    skipButtonText: {
        color: '#666',
        fontSize: getResponsiveValue(14, 15, 16),
        fontWeight: '500',

    },

    // Progress Section
    progressContainer: {
        paddingHorizontal: 20,
        marginBottom: getResponsiveValue(16, 20, 24),
    },

    progressTrack: {
        flexDirection: 'row',
        gap: 8,
    },

    progressDot: {
        height: 8,
        flex: 1,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
    },

    progressDotActive: {
        backgroundColor: '#4CAF50',
    },

    // Content Section
    contentSection: {
        flex: 1,
        paddingHorizontal: 20,
    },

    contentContainer: {
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

    iconContainer: {
        alignItems: 'center',
        marginBottom: getResponsiveValue(20, 25, 30),
    },

    titleText: {
        fontSize: getResponsiveValue(24, 28, 32),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: getResponsiveValue(8, 10, 12),
        lineHeight: getResponsiveValue(28, 32, 36),
    },

    subtitleText: {
        fontSize: getResponsiveValue(16, 18, 20),
        color: '#666',
        textAlign: 'center',
        marginBottom: getResponsiveValue(16, 20, 24),
        lineHeight: getResponsiveValue(22, 24, 26),
    },

    descriptionText: {
        fontSize: getResponsiveValue(14, 15, 16),
        color: '#666',
        textAlign: 'center',
        lineHeight: getResponsiveValue(20, 22, 24),
        marginBottom: getResponsiveValue(24, 30, 36),
    },

    // Demo Components
    demoContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: getResponsiveValue(12, 14, 16),
        padding: getResponsiveValue(16, 20, 24),
        marginBottom: getResponsiveValue(20, 25, 30),
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
    },

    voiceDemoActive: {
        backgroundColor: '#e8f5e8',
        borderColor: '#4CAF50',
    },

    voiceDemoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    voiceButton: {
        width: getResponsiveValue(64, 72, 80),
        height: getResponsiveValue(64, 72, 80),
        borderRadius: getResponsiveValue(32, 36, 40),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    voiceButtonActive: {
        backgroundColor: '#4CAF50',
    },

    voiceButtonInactive: {
        backgroundColor: '#ccc',
    },

    voiceTextContainer: {
        marginLeft: getResponsiveValue(16, 20, 24),
        flex: 1,
    },

    voiceStatusText: {
        fontSize: getResponsiveValue(16, 18, 20),
        fontWeight: '600',
        marginBottom: 4,
    },

    voiceExampleText: {
        fontSize: getResponsiveValue(12, 13, 14),
        color: '#666',
    },

    // Weather Card
    weatherCard: {
        borderRadius: getResponsiveValue(12, 14, 16),
        padding: getResponsiveValue(16, 20, 24),
        marginBottom: getResponsiveValue(20, 25, 30),
    },

    weatherHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    weatherTitle: {
        fontSize: getResponsiveValue(18, 20, 22),
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },

    weatherLocation: {
        fontSize: getResponsiveValue(12, 13, 14),
        color: 'rgba(255, 255, 255, 0.9)',
    },

    weatherGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    weatherTemp: {
        fontSize: getResponsiveValue(28, 32, 36),
        fontWeight: 'bold',
        color: 'white',
    },

    weatherCondition: {
        fontSize: getResponsiveValue(12, 13, 14),
        color: 'rgba(255, 255, 255, 0.9)',
        marginLeft: 8,
    },

    weatherRain: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    weatherRainText: {
        fontSize: getResponsiveValue(12, 13, 14),
        color: 'white',
        marginLeft: 8,
    },

    // Market Card
    marketCard: {
        backgroundColor: 'white',
        borderRadius: getResponsiveValue(12, 14, 16),
        padding: getResponsiveValue(16, 20, 24),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: getResponsiveValue(20, 25, 30),
    },

    marketTitle: {
        fontSize: getResponsiveValue(16, 18, 20),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },

    marketItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginBottom: 12,
    },

    marketCrop: {
        fontWeight: '600',
        color: '#333',
        fontSize: getResponsiveValue(14, 15, 16),
    },

    marketPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    marketPrice: {
        fontSize: getResponsiveValue(16, 18, 20),
        fontWeight: 'bold',
    },

    marketTrend: {
        fontSize: getResponsiveValue(12, 13, 14),
        fontWeight: '600',
    },

    // Feature List
    featureList: {
        gap: 12,
    },

    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    featureDot: {
        width: 8,
        height: 8,
        backgroundColor: '#4CAF50',
        borderRadius: 4,
        marginRight: 12,
    },

    featureText: {
        fontSize: getResponsiveValue(14, 15, 16),
        color: '#666',
        lineHeight: getResponsiveValue(20, 22, 24),
        flex: 1,
    },

    // Action Button
    actionButton: {
        backgroundColor: '#4CAF50',
        borderRadius: getResponsiveValue(12, 14, 16),
        paddingVertical: getResponsiveValue(12, 14, 16),
        paddingHorizontal: getResponsiveValue(24, 28, 32),
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginTop: getResponsiveValue(20, 25, 30),
        minHeight: getResponsiveValue(48, 52, 56),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    actionButtonRed: {
        backgroundColor: '#f44336',
        shadowColor: '#f44336',
    },

    actionButtonText: {
        color: 'white',
        fontSize: getResponsiveValue(16, 17, 18),
        fontWeight: 'bold',
        marginLeft: 8,
    },

    // Bottom Navigation
    bottomSection: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        padding: getResponsiveValue(16, 20, 24),
        paddingBottom: getResponsiveValue(25, 30, 35),
    },

    navigationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: getResponsiveValue(12, 14, 16),
        paddingHorizontal: getResponsiveValue(16, 20, 24),
        borderRadius: getResponsiveValue(20, 22, 24),
        minHeight: getResponsiveValue(44, 48, 52),
        gap: 8,
    },

    navButtonBack: {
        backgroundColor: '#f0f0f0',
    },

    navButtonNext: {
        backgroundColor: '#4CAF50',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },

    navButtonDisabled: {
        backgroundColor: '#f0f0f0',
        opacity: 0.5,
    },

    navButtonText: {
        fontSize: getResponsiveValue(14, 15, 16),
        fontWeight: '600',
    },

    navButtonTextBack: {
        color: '#666',
    },

    navButtonTextNext: {
        color: 'white',
    },

    navButtonTextDisabled: {
        color: '#ccc',
    },

    screenCounter: {
        fontSize: getResponsiveValue(12, 13, 14),
        color: '#666',
        paddingHorizontal: 16,
    },
});