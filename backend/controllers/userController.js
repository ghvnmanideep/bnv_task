const User = require('../models/User');
const { Parser } = require('json2csv');
// Create User
exports.createUser = async (req, res) => {
    try {
        console.log("Creating user:", req.body);
        const {firstName,lastName,email,mobile,gender,status,location}=req.body;
        const profileImage=req.file?req.file.path:null;
        const newUser = new User({firstName,lastName,email,mobile,gender,status,profileImage,location});
        await newUser.save();
        console.log("User created successfully:", newUser._id);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(400).json({message:error.message });
    }
};
// Get Users with Pagination & Search
exports.getUsers = async (req, res) => {
    try {
        console.log("Fetching users with query:", req.query);
        const {page=1,limit=5,search='',gender,status,sort}=req.query;
        const query = {$or:[{firstName:{$regex:search, $options: 'i' } },
                {lastName:{$regex:search,$options:'i'}},{email:{$regex:search, $options:'i'}}]};
        if (gender) query.gender = gender;
        if (status) query.status = status;
        const sortQuery = sort === 'new' ? { createdAt: -1 } : sort === 'old' ? { createdAt: 1 } : { createdAt: -1 };
        
        console.log("Constructed MongoDB query:", JSON.stringify(query));
        
        const users = await User.find(query)
            .sort(sortQuery)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await User.countDocuments(query);
        
        console.log(`Found ${users.length} users out of ${count} total`);
        
        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get Single User
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, gender, status, location } = req.body;
        const updateData = { firstName, lastName, email, mobile, gender, status, location };
        
        if (req.file) {
            updateData.profileImage = req.file.path;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export to CSV
exports.exportToCSV = async (req, res) => {
    try {
        const users = await User.find({});
        const fields = ['firstName', 'lastName', 'email', 'mobile', 'gender', 'status', 'location', 'createdAt'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(users);

        res.header('Content-Type', 'text/csv');
        res.attachment('users.csv');
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
