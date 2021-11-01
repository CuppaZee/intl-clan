import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  createTheme,
  Paper,
  Button,
  Icon,
} from "@mui/material";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import useWindowSize from "./useWindowSize";
import { ThemeProvider } from "@mui/system";
import {LightMode as SunIcon, DarkMode as MoonIcon} from "@mui/icons-material";

interface ClanData {
  amount: number;
  data: { [key: string]: number };
  details: {
    clan_id: number;
    name: string;
    simple_name: string;
    tagline: string;
    created_by_userid: number;
    logo: string;
    privacy: "private" | "public" | "hidden";
    goal: "Casual Clan" | "Level 1" | "Level 2" | "Level 3" | "Level 4" | "Level 5";
    members: number;
  };
  users: {
    user_id: string;
    username: string;
    is_admin: "0" | "1";
  }[];
}

interface Data {
  clans: ClanData[];
  requirementTitle: string;
  requirementSuffix: string;
}

const Home: NextPage = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(!!window.localStorage.INTL_DARK);
  }, []);
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    (async () => {
      const response = await fetch("https://server.cuppazee.app/clan/intl");
      setData((await response.json()).data);
    })();
  }, []);
  const windowSize = useWindowSize();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "dark" : "light",
        },
      }),
    [dark]
  );
  return (
    <ThemeProvider theme={theme}>
      <Paper>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <TableContainer style={{ maxHeight: "100vh" }}>
          <Table size={windowSize.width < 800 ? "small" : "medium"} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>
                  Clan Name
                  <Button
                    style={{ marginLeft: 4 }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      if (dark) {
                        delete localStorage.INTL_DARK;
                      } else {
                        localStorage.INTL_DARK = "YES";
                      }
                      setDark(!dark);
                    }}>
                    {dark ? <SunIcon /> : <MoonIcon />}
                  </Button>
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>{data?.requirementTitle}</TableCell>
                {new Array(10).fill(0).map((_, index) => (
                  <TableCell></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.clans
                .slice()
                .sort((a, b) => b.amount - a.amount)
                .map(clan => (
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}>
                        <Avatar
                          style={{ width: 24, height: 24, marginRight: 8 }}
                          alt={clan.details.name}
                          title={clan.details.name}
                          src={`https://munzee.global.ssl.fastly.net/images/clan_logos/${Number(
                            clan.details.clan_id
                          ).toString(36)}.png`}
                        />
                        {clan.details.name}
                      </div>
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>{clan.amount}</TableCell>
                    {clan.users.map(user => (
                      <Tooltip
                        title={`${user.username}: ${clan.data[user.user_id] ?? "0"} ${
                          data?.requirementSuffix
                        }`}>
                        <TableCell>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}>
                            <Avatar
                              style={{ width: 24, height: 24, marginRight: 8 }}
                              alt={user.username}
                              title={user.username}
                              src={`https://munzee.global.ssl.fastly.net/images/avatars/ua${Number(
                                user.user_id
                              ).toString(36)}.png`}
                            />
                            {clan.data[user.user_id] || "0"}
                          </div>
                        </TableCell>
                      </Tooltip>
                    ))}
                    {new Array(10 - clan.users.length).fill(0).map((_, index) => (
                      <TableCell />
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </ThemeProvider>
  );
};

export default Home;
