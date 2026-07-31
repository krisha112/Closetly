const getDashboardData = async (req, res) => {
    try {

        const dashboard = {
            totalClothes: 0,
            totalOutfits: 0,
            favoriteOutfits: 0,
            recentClothes: []
        };

        res.status(200).json(dashboard);

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};

module.exports = {
    getDashboardData
};