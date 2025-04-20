router.get('/mentor-requests', auth, async (req, res) => {
    try {
        console.log('Fetching mentorship requests for user:', req.user);
        
        // Get all requests without population first
        const rawRequests = await MentorshipRequest.find({}).lean();
        console.log('Raw requests:', rawRequests.map(req => ({
            _id: req._id,
            studentId: req.studentId,
            mentorId: req.mentorId,
            status: req.status
        })));
        
        // Check which student IDs are valid
        const studentIds = rawRequests.map(req => req.studentId).filter(id => id);
        console.log('Student IDs in requests:', studentIds);
        
        // Verify these students exist
        const existingStudents = await User.find({
            _id: { $in: studentIds }
        }).select('_id name email');
        console.log('Existing students:', existingStudents);
        
        // Get requests with valid student references
        const validRequests = await MentorshipRequest.find({
            studentId: { $in: existingStudents.map(s => s._id) }
        })
        .populate('studentId', 'name email')
        .populate('mentorId', 'name email')
        .lean();
        
        console.log('Valid requests with populated data:', validRequests.map(req => ({
            _id: req._id,
            student: req.studentId ? {
                name: req.studentId.name,
                email: req.studentId.email
            } : null,
            mentor: req.mentorId ? {
                name: req.mentorId.name,
                email: req.mentorId.email
            } : null,
            status: req.status
        })));
        
        res.json(validRequests);
    } catch (error) {
        console.error('Error fetching mentorship requests:', error);
        res.status(500).json({ message: 'Error fetching mentorship requests', error: error.message });
    }
}); 