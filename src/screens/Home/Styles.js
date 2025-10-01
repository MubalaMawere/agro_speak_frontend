import StyleSheetClass, {Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');

// Responsive helper (matching your pattern)
const isSmallScreen = height < 700;
const isMediumScreen = height >= 700 && height < 900;
const isLargeScreen = height >= 900;

export const getResponsiveValue = (small, medium, large) => {
    if (isSmallScreen) return small;
    if (isMediumScreen) return medium;
    return large;
};


export  const  styles = {
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    // Header Section
    headerSection: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: getResponsiveValue(0, 0, 0),
        paddingBottom: getResponsiveValue(0, 0, 0),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,

    },

    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: getResponsiveValue(8, 10, 12),
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
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },

    logoText: {
        fontSize: getResponsiveValue(18, 20, 22),
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 0.5,
    },

    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    headerIconButton: {
        width: getResponsiveValue(36, 44, 50),
        height: getResponsiveValue(36, 44, 50),
        borderRadius: getResponsiveValue(18, 30, 22),
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },

    greetingContainer: {
        marginTop: 4,
    },

    greetingText: {
        fontSize: getResponsiveValue(24, 28, 32),
        fontWeight: 'bold',
        color: '#333',
    },

    subGreetingText: {
        fontSize: getResponsiveValue(14, 15, 16),
        color: '#666',
        marginTop: 2,
    },

    // Voice Assistant Button
    voiceSection: {
        paddingHorizontal: 20,
        paddingVertical: getResponsiveValue(20, 25, 30),
        alignItems: 'center',
    },

    voiceButton: {
        width: getResponsiveValue(120, 140, 160),
        height: getResponsiveValue(120, 140, 160),
        borderRadius: getResponsiveValue(60, 70, 80),
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
        position: 'relative',
    },

    voiceButtonActive: {
        backgroundColor: '#f44336',
        shadowColor: '#f44336',
    },

    voiceIconContainer: {
        marginBottom: 4,
    },

    voiceButtonText: {
        color: 'white',
        fontSize: getResponsiveValue(12, 13, 14),
        fontWeight: '600',
        textAlign: 'center',
    },

    voiceStatusText: {
        fontSize: getResponsiveValue(16, 18, 20),
        fontWeight: '600',
        color: '#4CAF50',
        marginTop: getResponsiveValue(12, 15, 18),
        textAlign: 'center',
    },

    voiceStatusActive: {
        color: '#f44336',
    },

    voiceHintText: {
        fontSize: getResponsiveValue(12, 13, 14),
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },

    // Quick Info Cards Section
    cardsSection: {
        paddingHorizontal: 20,
        paddingBottom: getResponsiveValue(15, 18, 20),
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: getResponsiveValue(12, 15, 18),
    },

    sectionTitle: {
        fontSize: getResponsiveValue(18, 20, 22),
        fontWeight: 'bold',
        color: '#333',
    },

    seeAllButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },

    seeAllText: {
        fontSize: getResponsiveValue(13, 14, 15),
        color: '#4CAF50',
        fontWeight: '600',
    },

    cardsGrid: {
        gap: getResponsiveValue(12, 15, 18),
    },

    cardRow: {
        flexDirection: 'row',
        gap: getResponsiveValue(12, 15, 18),
    },

    // Card Styles
    infoCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: getResponsiveValue(12, 14, 16),
        padding: getResponsiveValue(16, 18, 20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: getResponsiveValue(8, 10, 12),
    },

    cardIcon: {
        width: getResponsiveValue(28, 32, 36),
        height: getResponsiveValue(28, 32, 36),
        borderRadius: getResponsiveValue(6, 7, 8),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },

    cardTitle: {
        fontSize: getResponsiveValue(13, 14, 15),
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },

    cardValue: {
        fontSize: getResponsiveValue(18, 20, 22),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },

    cardSubtext: {
        fontSize: getResponsiveValue(11, 12, 13),
        color: '#666',
    },

    // Weather Card Specific
    weatherCard: {
        backgroundColor: '#2196F3',
    },

    weatherCardContent: {
        alignItems: 'center',
    },

    weatherIcon: {
        marginBottom: 8,
    },

    weatherTemp: {
        fontSize: getResponsiveValue(28, 32, 36),
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 2,
    },

    weatherCondition: {
        fontSize: getResponsiveValue(12, 13, 14),
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 4,
    },

    weatherLocation: {
        fontSize: getResponsiveValue(10, 11, 12),
        color: 'rgba(255, 255, 255, 0.8)',
    },

    // Market Card Specific
    marketTrend: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },

    marketTrendText: {
        fontSize: getResponsiveValue(11, 12, 13),
        fontWeight: '600',
        marginLeft: 4,
    },

    // News Card Specific
    newsAlert: {
        backgroundColor: '#fff3cd',
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        marginTop: 8,
    },

    newsAlertText: {
        fontSize: getResponsiveValue(11, 12, 13),
        color: '#856404',
        fontWeight: '500',
    },

    // Recent Activity Section
    activitySection: {
        paddingHorizontal: 20,
        paddingBottom: getResponsiveValue(20, 25, 30),
    },

    activityList: {
        gap: getResponsiveValue(8, 10, 12),
    },

    activityItem: {
        backgroundColor: 'white',
        borderRadius: getResponsiveValue(8, 9, 10),
        padding: getResponsiveValue(12, 14, 16),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    activityIcon: {
        width: getResponsiveValue(32, 36, 40),
        height: getResponsiveValue(32, 36, 40),
        borderRadius: getResponsiveValue(16, 18, 20),
        backgroundColor: '#e8f5e8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    activityContent: {
        flex: 1,
    },

    activityText: {
        fontSize: getResponsiveValue(13, 14, 15),
        color: '#333',
        fontWeight: '500',
        marginBottom: 2,
    },

    activityTime: {
        fontSize: getResponsiveValue(11, 12, 13),
        color: '#666',
    },

    // Bottom Navigation
    bottomNavigation: {
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingVertical: getResponsiveValue(8, 10, 12),
        paddingBottom: getResponsiveValue(20, 25, 30),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },

    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: getResponsiveValue(8, 10, 12),
    },

    navIcon: {
        marginBottom: 4,
    },

    navLabel: {
        fontSize: getResponsiveValue(10, 11, 12),
        fontWeight: '500',
        color: '#666',
    },

    navLabelActive: {
        color: '#4CAF50',
        fontWeight: '600',
    },

    // Pulse Animation Ring
    pulseRing: {
        position: 'absolute',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: getResponsiveValue(60, 70, 80),
    },

    // Weather Modal Styles
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },

    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        margin: 20,
        maxHeight: '90%',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ECF0F1',
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
};