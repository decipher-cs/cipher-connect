import { Switch, styled, SwitchProps } from '@mui/material'

interface StyledSwitchProps extends SwitchProps {
    labelWhenOff: string
    labelWhenOn: string
}

export const ButtonSwitch = styled(Switch, {
    shouldForwardProp: prop => prop !== 'labelWhenOn' && prop !== 'labelWhenOff',
})<StyledSwitchProps>(({ theme, labelWhenOn, labelWhenOff }) => ({
    width: 180,
    height: 30,
    padding: 0,
    marginInline: 10,
    '.Mui-checked+.MuiSwitch-track': {
        ':before': { color: theme.palette.text.primary },
        ':after': { color: theme.palette.primary.main },
    },
    '.MuiSwitch-track, .Mui-checked+.MuiSwitch-track': {
        borderRadius: theme.shape.borderRadius,
        color: 'grey',
        backgroundColor: 'transparent',
        border: 'solid grey 1px',
    },
    '.MuiSwitch-track': {
        ':before, :after': {
            position: 'absolute',
            textTransform: 'uppercase',
            // fontWeight: theme.typography.fontWeightMedium,
            fontWeight: theme,
        },
        ':before': {
            content: `"${labelWhenOff}"`,
            transform: 'translateX(-102px)',
            right: 0,
            color: theme.palette.primary.main,
        },
        ':after': {
            content: `"${labelWhenOn}"`,
            transform: 'translateX(95px)',
            color: theme.palette.text.primary,
        },
    },

    '.MuiSwitch-switchBase': {
        padding: 0,
        border: 'solid lightblue 1px',
        borderRadius: 3,
        width: 90,
        height: 30,
        backgroundColor: theme.palette.primary.main,
        textTransform: 'uppercase',

        // 1. make knock-out text work somehow
        // 2. or chnage text based on checked state
        ':before': {
            content: `"${labelWhenOff}"`,
            color: theme.palette.primary.contrastText,
            fontWeight: theme.typography.fontWeightMedium,
        },

        '&.Mui-checked': {
            transform: 'translateX(90px)',
            ':before': {
                content: `"${labelWhenOn}"`,
                color: theme.palette.primary.contrastText,
                fontWeight: theme.typography.fontWeightMedium,
            },
        },
        '.MuiSwitch-thumb': { display: 'none' },
        '&:hover': { boxShadow: 'none', backgroundColor: theme.palette.primary.main },
    },
}))
