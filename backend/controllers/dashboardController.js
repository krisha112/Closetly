const getDashboardData = async (req, res) => {

    const dashboard = {
        totalClothes: 0,
        totalOutfits: 0,
        favoriteOutfits: 0,
        recentClothes: []
    };

    res.status(200).json(dashboard);

};

module.exports = {
    getDashboardData
};