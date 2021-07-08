export const styles = (theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
  selected: {
    backgroundColor: "#D4EAF5 !important",
    color: "#89ADC3 !important",
  },
  ul: {
    "& .MuiPaginationItem-root": {
      color: "grey",
    },
  },
});
