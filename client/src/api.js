import config from './config'
import { useQuery } from '@tanstack/react-query'

function loadSuggestion(key, familiarity) {
  return useQuery({
    queryKey: ['suggestion', key],
    queryFn: () => {
      return fetch(`${config.apiHost}/suggestion?familiarity=${familiarity / 100}`)
        .then(res => res.json())
    },
  })
}

function loadHymnHistoryById(id) {
  return useQuery({
    queryKey: ['history', id],
    queryFn: () => {
      return fetch(`${config.apiHost}/hymns/history/${id}`)
        .then(res => res.json())
    },
  })
}

export default {
  loadSuggestion,
  loadHymnHistoryById,
}
