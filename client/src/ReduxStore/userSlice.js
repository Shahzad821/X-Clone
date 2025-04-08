import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.authUser = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.authUser = null;
      state.isAuthenticated = false;
    },
  },
});
export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
