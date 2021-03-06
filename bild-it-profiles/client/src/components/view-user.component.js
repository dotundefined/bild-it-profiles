import React, { Component } from 'react';
import Exercise from './exercise.component';
import Alert from 'react-s-alert';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import AddBox from '@material-ui/icons/AddBox';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ROLES from '../constants/roles';

import { formatDate } from '../utils/date-formatter';

import "react-datepicker/dist/react-datepicker.css";

import AuthService from '../utils/auth-service';

const styles = (theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    addButton: {
        float: 'right',
        boxShadow: 'none',
        '&:hover': {
            color: 'white',
        },
    }
}));

class ViewUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.AuthService = new AuthService();
        this.deleteExercise = this.deleteExercise.bind(this);
    }

    componentDidMount() {
        this.AuthService.fetch(`/exercises/${this.props.match.params.id}`, {
            method: 'GET'
        }).then(res => {
            this.setState({
                exercises: res.data,
                user: this.AuthService.getProfile()
            })
        }).catch((error) => {
            console.log(error);
        })
    }

    deleteExercise(id) {
        this.AuthService.fetch(`/exercises/${id}`, {
            method: 'DELETE'
        }).then(() => {
            Alert.success('Exercise successfully deleted.');
        });

        const exercises = this.state.user.exercises.filter(el => el._id !== id)
        const user = this.state.user;
        user.exercises = exercises;
        this.setState({
            user: user
        })
    }

    exerciseList() {
        if (this.state.exercises)
            return this.state.exercises ? this.state.exercises.map(currentexercise => {
                return <Exercise
                    exercise={currentexercise}
                    deleteExercise={this.deleteExercise}
                    key={currentexercise._id} />;
            }) : '';
    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                <h3>{this.state.user ? this.state.user.fullName : ''}</h3>
                <hr />
                <h4>{this.state.user ? this.state.user.firstName : ''}</h4>
                <h4>{this.state.user ? this.state.user.lastName : ''}</h4>
                <h4>{this.state.user ? this.state.user.email : ''}</h4>
                <h4>{this.state.user ? formatDate(this.state.user.dob) : ''}</h4>
                <hr />
                <div>
                    <Fab color="primary" variant="extended" to="/create" aria-label="delete" className={classes.addButton} component={Link}>
                        New exercise log
                            <AddBox className="ml-3" />
                    </Fab>
                    <Typography className={classes.titleDiv} variant="h4" component="h3" style={{ overflow: 'hidden' }} display="block">
                        <span>Logged exercises</span>
                    </Typography>
                    <hr />
                </div>
                <div>
                    {this.exerciseList()}
                </div>
            </div>
        )
    }
}

ViewUser.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewUser);