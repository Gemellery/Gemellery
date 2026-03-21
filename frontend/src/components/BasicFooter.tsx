const BasicFooter = () => {
    return (
        <footer className="text-center py-6 text-sm text-gray-700 bg-white/30 backdrop-blur-xl border-t border-white/20 shadow-lg tracking-wide">
            © {new Date().getFullYear()} Gemellery. All Rights Reserved.
        </footer>
    );
};

export default BasicFooter;
