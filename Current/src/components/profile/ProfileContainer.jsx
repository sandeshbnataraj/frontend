import React from 'react';
import ProfileView from './ProfileView';
import './profile.scss';
import { connect } from 'react-redux';
import { getUserInfo, getUserFollowers, getPartners, getOtherUserProfile } from '../../actions/userInfoActions';
import { getUserPublications, getOtherUserPublications } from '../../actions/userPublicationAction';
import queryString from 'query-string'

class ProfileContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      lastScrollPos: 0,
      isCurrentUser: 1
    }
    this.trackScrolling = this.trackScrolling.bind(this)
    this.loadMoreData = this.loadMoreData.bind(this)
  }
  componentDidMount() {
    const location = this.props.location
    if (location.state && location.state.currentuser === 0) {
      this.setState({ isCurrentUser: location.state.currentuser })
      let user = queryString.parse(location.search).user_id
      this.props.getOtherUserProfile(user)
      this.props.getOtherUserPublications(user)
    }
    else {
      console.log('in ele')
      if (!this.props.userInfo.user) {
        this.props.getUserInfo();
      }
    }
    if (this.props.userFollowers.followers.length === 0) {
      this.props.getUserFollowers();
    }
    if (this.props.userPartners.partners.length === 0) {
      this.props.getPartners();
    }
    document.addEventListener('scroll', this.trackScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  loadMoreData = () => {
    if (this.props.userPublications.noMoreData || this.props.userPublications.loading) {
      return;
    }
    if (this.state.isCurrentUser === 1) {
      this.props.getUserPublications({ page: this.props.userPublications.page + 1 });
      this.props.userPublications.page = this.props.userPublications.page + 1  
    }
    else
      this.props.getOtherUserPublications({ page: this.props.otherUserPublications.page + 1   });
      this.props.otherUserPublications.page = this.props.otherUserPublications.page + 1  
  }

  trackScrolling = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    let userPublications = []
    if (this.state.isCurrentUser === 1)
      userPublications = this.props.userPublications;
    else
      userPublications = this.props.otherUserPublications;

    if (!userPublications.noMoreData && !userPublications.loading
      && this.state.lastScrollPos < scrolled && Math.ceil(scrolled) >= scrollable - 100) {
      this.loadMoreData();
    }

    this.setState({ lastScrollPos: scrolled });
  }

  render() {
    const { userPartners, userPublications, userFollowers, userInfo, otherUserInfo, otherUserPublications } = this.props;
    return (
      <ProfileView
        userPartners={userPartners.partners}
        loading={userPublications.loading}
        userFollowers={userFollowers.followers}
        currentUserState={this.state.isCurrentUser}
        userPublications={this.state.isCurrentUser === 1 ? userPublications.publications : otherUserPublications.publications}
        userInfo={this.state.isCurrentUser === 1 ? userInfo : otherUserInfo}
      />
    );
  }
}

const mapStateToProps = state => ({
  userPartners: state.userPartners,
  userInfo: state.userInfo,
  userPublications: state.userPublications,
  userFollowers: state.userFollowers,
  otherUserInfo: state.otherUserInfo,
  otherUserPublications: state.otherUserPublications
});

export default connect(
  mapStateToProps,
  { getUserInfo, getUserPublications, getUserFollowers, getPartners, getOtherUserProfile, getOtherUserPublications }
)(ProfileContainer); 