FROM python
RUN pip install flask
WORKDIR /front.py
COPY . .
ENV FLASK_APP=main.py
EXPOSE 5000
CMD ["flask", "run", "--host", "0.0.0.0"]