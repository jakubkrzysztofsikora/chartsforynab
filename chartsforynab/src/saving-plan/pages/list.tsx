import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List as MuiList,
  Paper,
  Typography,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import TollIcon from "@mui/icons-material/Toll";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useRouter } from "next/router";

export type ListProps = { className?: string };

export const List: React.FC<ListProps> = ({ className }) => {
  const router = useRouter();

  return (
    <Paper className={className}>
      <div className="header">
        <Typography variant="h1">Your saving plans</Typography>
        <IconButton onClick={() => router.push("/saving-plans/new")}>
          <AddBoxIcon />
        </IconButton>
      </div>
      <MuiList>
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="open">
              <LaunchIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <TollIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Na poduche"
            secondary="Save 40 000 PLN in 13 months"
          />
        </ListItem>
      </MuiList>
    </Paper>
  );
};
