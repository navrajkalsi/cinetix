# Reference: https://fastapi.tiangolo.com/advanced/settings/#install-pydantic-settings
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # case insensitive wrt .env

    database_url: str
    debug: bool = False
    allowed_origins: str = ""

    @field_validator("allowed_origins")
    def parse_allowed_origins(cls, v: str) -> list[str]:
        return v.split(",") if v else []

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)


settings = Settings()
