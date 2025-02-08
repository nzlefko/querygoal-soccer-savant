
import { supabase } from "@/integrations/supabase/client";

interface MatchData {
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  league: string;
  season: string;
  match_date: string;
}

interface StatisticData {
  match_id: number;
  stat_type: string;
  home_value: number;
  away_value: number;
}

export class FootballService {
  private API_URL = 'https://v3.football.api-sports.io';
  private headers: HeadersInit;

  constructor() {
    this.headers = {
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': process.env.API_FOOTBALL_KEY || '',
    };
  }

  async fetchAndStoreMatches(league: string, season: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.API_URL}/fixtures?league=${league}&season=${season}`,
        { headers: this.headers }
      );
      const data = await response.json();

      if (data.response) {
        const matches: MatchData[] = data.response.map((match: any) => ({
          home_team: match.teams.home.name,
          away_team: match.teams.away.name,
          home_score: match.goals.home || 0,
          away_score: match.goals.away || 0,
          league,
          season,
          match_date: match.fixture.date,
        }));

        const { error } = await supabase.from('matches').insert(matches);
        
        if (error) {
          console.error('Error storing matches:', error);
          throw error;
        }
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  async getMatchStatistics(league: string, season: string) {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('league', league)
      .eq('season', season);

    if (error) {
      console.error('Error fetching match statistics:', error);
      throw error;
    }

    return data;
  }
}

export const createFootballService = () => new FootballService();
