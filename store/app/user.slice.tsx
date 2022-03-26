import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserModel from '../../model/user.model';

const initialState: UserModel = {
    email: '',
};

const UserSlice = createSlice({
    name: 'app/user',
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<UserModel>) => payload,
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser } = UserSlice.actions;

export default UserSlice.reducer;
