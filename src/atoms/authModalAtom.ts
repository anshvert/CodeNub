import {atom, RecoilState} from "recoil"

export type AuthModalState = {
    isOpen: boolean
    type: 'login' | 'register' | 'forgotPassword'
}
const initialAuthModalState: AuthModalState = {
    isOpen: false,
    type: 'login'
}

export const authModalState:RecoilState<AuthModalState>= atom<AuthModalState>({
    key: "authModalState",
    default: initialAuthModalState
})
