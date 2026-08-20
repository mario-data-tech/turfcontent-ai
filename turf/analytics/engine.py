import math

class TurfAnalyticsEngine:
    @staticmethod
    def calculate_implied_probability(decimal_odds: float) -> float:
        """Calcula la probabilidad implícita a partir de la cuota decimal."""
        if decimal_odds <= 1.0:
            return 0.0
        return 1.0 / decimal_odds

    @staticmethod
    def compute_horse_rating(form_score: float, distance_score: float, track_score: float, jockey_score: float, trainer_score: float) -> float:
        """Calcula un score explicable ponderado para el caballo."""
        # Pesos lógicos para el modelo cuantitativo
        weights = {
            "form": 0.35,
            "distance": 0.20,
            "track": 0.15,
            "jockey": 0.15,
            "trainer": 0.15
        }
        total_score = (
            form_score * weights["form"] +
            distance_score * weights["distance"] +
            track_score * weights["track"] +
            jockey_score * weights["jockey"] +
            trainer_score * weights["trainer"]
        )
        return round(total_score, 2)

    @classmethod
    def evaluate_market_edge(cls, entries_data: list) -> list:
        """
        Recibe una lista de entradas con ratings y cuotas, 
        normaliza probabilidades del modelo y calcula el Edge.
        """
        # 1. Calcular ratings y probabilidades crudas del modelo
        scored_entries = []
        total_score = 0
        
        for entry in entries_data:
            score = cls.compute_horse_rating(
                entry.get("form_score", 70.0),
                entry.get("distance_score", 70.0),
                entry.get("track_score", 70.0),
                entry.get("jockey_score", 70.0),
                entry.get("trainer_score", 70.0)
            )
            total_score += score
            scored_entries.append({**entry, "score": score})

        # 2. Normalizar probabilidad del modelo (%)
        results = []
        for entry in scored_entries:
            model_prob = (entry["score"] / total_score) * 100.0 if total_score > 0 else 0.0
            market_prob = cls.calculate_implied_probability(entry.get("odds", 2.0)) * 100.0
            
            # Edge = Probabilidad del Modelo - Probabilidad Implícita del Mercado
            edge = round(model_prob - market_prob, 2)
            
            results.append({
                "horse_name": entry.get("horse_name"),
                "jockey": entry.get("jockey"),
                "trainer": entry.get("trainer"),
                "odds": entry.get("odds"),
                "rating": entry["score"],
                "model_prob": round(model_prob, 2),
                "market_prob": round(market_prob, 2),
                "edge": edge
            })
            
        # Ordenar por mayor Edge / Rating
        results.sort(key=lambda x: x["rating"], reverse=True)
        return results
