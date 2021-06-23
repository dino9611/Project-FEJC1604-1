import { connect } from 'react-redux';
import UserProfile from '../../pages/users/UserProfile';

const mapStateToProps = (state) => {
    return {
        userProfile: state.userProfile
    };
};
const UserProfileContainer = connect(
    mapStateToProps, (UserProfile)
);

export default UserProfileContainer;