import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Link,
  useTheme,
  Tooltip,
} from "@mui/material";
import { GitHub, Brightness4, Brightness7 } from "@mui/icons-material";
import { ColorModeContext } from "../ThemeContext";

const Header: React.FC = () => {
  const theme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);
  const isDark = theme.palette.mode === "dark";

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Stack direction="row" spacing={1} sx={{ marginLeft: "auto" }}>
          <Tooltip title={isDark ? "Modo claro" : "Modo oscuro"}>
            <IconButton
              color="primary"
              size="small"
              onClick={toggleColorMode}
              aria-label="toggle theme"
            >
              {isDark ? (
                <Brightness7 fontSize="small" />
              ) : (
                <Brightness4 fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Link
            href="https://github.com/afssx/TU_REPOSITORIO"
            target="_blank"
            rel="noopener"
            underline="none"
          >
            <IconButton
              color="primary"
              size="small"
              aria-label="GitHub repository"
            >
              <GitHub fontSize="small" />
            </IconButton>
          </Link>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
