from rest_framework.throttling import UserRateThrottle


class OncePerDayUserThrottle(UserRateThrottle):
    rate = '1/day'


class OncePerSecondUserThrottle(UserRateThrottle):
    rate = '1/second'


class TenPerMinuteUserThrottle(UserRateThrottle):
    rate = '10/minute'
