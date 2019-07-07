import React from 'react'
import PromotedOrLikedUsersView from './PromotedOrLikedUsersView'
import { connect } from 'react-redux'
import { fetchLikedUsers, fetchPromotedUsers } from '../../actions/userPublicationAction'
import './modal.scss'
class PromotedOrLikedUsersContainer extends React.Component {
    constructor() {
        super()
        this.state = {page:1}
        this.loadMore = this.loadMore.bind(this)
    }
    loadMore() {
        if(this.props.type === 'liked' &&(!this.props.likedUsers.loading&&!this.props.likedUsers.noMoreData)) {
            this.props.fetchLikedUsers(this.props.id,{'page':this.state.page + 1})
            this.setState({'page':this.state.page + 1})
        }
        else if(this.props.type === 'promotes' &&(!this.props.promotedUsers.loading&&!this.props.promotedUsers.noMoreData)) {
            this.props.fetchPromotedUsers(this.props.id,{'page':this.state.page + 1})
            this.setState({'page':this.state.page + 1})
        }
    }
    componentDidMount() {
        if (this.props.type === 'liked') {
            this.props.fetchLikedUsers(this.props.id)
        }
        else {
            this.props.fetchPromotedUsers(this.props.id)
        }
    }
    render() {
        return (
            <PromotedOrLikedUsersView loadMore={this.loadMore} {...this.props} />
        )
    }
}
const mapStateToProps = state => ({
    likedUsers: state.likedUsers,
    promotedUsers: state.promotedUsers,
});
const mapDispatchersToProps = {
    fetchLikedUsers,
    fetchPromotedUsers
};

export default connect(mapStateToProps, mapDispatchersToProps)(PromotedOrLikedUsersContainer)